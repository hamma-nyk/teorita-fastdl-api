import { NextResponse } from "next/server";
import { Redis } from '@upstash/redis';

// Inisialisasi Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user = searchParams.get("user");

  if (!user) {
    return NextResponse.json({ error: "Username diperlukan" }, { status: 400 });
  }

  const rawKeys = await redis.get<string>('MY_KEYS');

  if (!rawKeys) {
    return NextResponse.json({ error: "No keys found in Redis" }, { status: 500 });
  }

  // 2. Ubah string jadi Array dan Shuffle
  const apiKeys = rawKeys.split(',').map(k => k.trim()).filter(Boolean);
  const shuffledKeys = apiKeys.sort(() => Math.random() - 0.5);

  const jsCode = `
    export default async ({ page }) => {
        let resultData = null;
        page.on('response', async (res) => {
            if (res.url().includes('/userInfo')) {
                try {
                    const data = await res.json();
                    if (data) resultData = data;
                } catch (e) {}
            }
        });

        try {
            await page.goto('https://fastdl.app/en', { waitUntil: 'domcontentloaded', timeout: 30000 });
            await page.waitForSelector('#search-form-input');
            await page.type('#search-form-input', '${user}', { delay: 50 });
            await page.click('.search-form__button');

            for (let i = 0; i < 15; i++) {
                if (resultData) break;
                await new Promise(r => setTimeout(r, 1000));
            }
        } catch (err) {
            return { data: { error: err.message }, type: "application/json" };
        }
        return { data: resultData, type: "application/json" };
    };
    `;

  let lastError = null;

  // 2. Loop melalui kunci yang sudah diacak
  for (const key of shuffledKeys) {
    try {
      const url = `https://production-sfo.browserless.io/chromium/function?blockAds=false&timeout=60000&token=${key}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/javascript" },
        body: jsCode,
        cache: "no-store", // Memastikan tidak ada cache
      });

      console.log(`Menguji key ${key.substring(0, 6)}... Status: ${response.status}`);

      // Jika status error yang berhubungan dengan Key (Limit/Auth/Bad Request)
      if (
        response.status === 401 ||
        response.status === 429 ||
        response.status === 400
      ) {
        lastError = `Key ${key.substring(0, 6)}... Error: ${response.status}`;
        console.warn(lastError);
        continue; // Coba key berikutnya
      }

      if (response.ok) {
        const result = await response.json();
        // Kirim hasil jika berhasil
        return NextResponse.json(result.data || result);
      }
    } catch (error: any) {
      lastError = error.message;
      console.error(
        `Network Error dengan key ${key.substring(0, 6)}... :`,
        error.message,
      );
      continue;
    }
  }

  // 3. Jika semua kunci dalam array shuffledKeys gagal
  return NextResponse.json(
    {
      error: "Sistem kewalahan. Semua kunci cadangan telah dicoba namun gagal.",
      details: lastError,
    },
    { status: 503 },
  );
}
