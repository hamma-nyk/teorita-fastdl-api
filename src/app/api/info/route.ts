import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const user = searchParams.get('user');

    if (!user) {
        return NextResponse.json({ error: "Username diperlukan" }, { status: 400 });
    }

    const apiKey = process.env.BROWSERLESS_API_KEY;
    const url = `https://production-sfo.browserless.io/function?token=${apiKey}`;
    
    // Logika JS yang akan dijalankan di Browserless
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

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/javascript' },
            body: jsCode,
        });

        const result = await response.json();
        // Return field 'data' hasil eksekusi Browserless
        return NextResponse.json(result.data || result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}