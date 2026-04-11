import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user = searchParams.get("user");

  if (!user) {
    return NextResponse.json({ error: "Username diperlukan" }, { status: 400 });
  }

  // 1. Ambil API Keys dan acak urutannya (Shuffle)
  const apiKeysRaw = process.env.BROWSERLESS_API_KEYS || "";
  const allKeys = apiKeysRaw.split(",").filter((k) => k.trim() !== "");

  // Algoritma Shuffle sederhana
  const shuffledKeys = allKeys.sort(() => Math.random() - 0.5);

  if (shuffledKeys.length === 0) {
    return NextResponse.json(
      { error: "Konfigurasi API Keys kosong" },
      { status: 500 },
    );
  }

  const jsCode = `
    export default async ({ page }) => {
        let resultData = null;
        page.on('response', async (res) => {
            if (res.url().includes('/postsV2')) {
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
      const url = `https://production-sfo.browserless.io/function?token=${key}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/javascript" },
        body: jsCode,
        cache: "no-store", // Memastikan tidak ada cache
      });

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
