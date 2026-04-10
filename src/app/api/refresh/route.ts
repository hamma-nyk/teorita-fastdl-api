import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const result = { data: {'status': 'service has been refreshed.'} };
    try {
        return NextResponse.json(result.data || result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}