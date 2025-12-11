
import { NextRequest, NextResponse } from 'next/server';

const MASTER_KEYS = {
    'NORMAL': process.env.GATE_MASTER_NORMAL || 'MASTER_GATE_NORMAL', // Fallback for dev, but env preferred
    'VIP': process.env.GATE_MASTER_VIP || 'MASTER_GATE_VIP'
};

export async function POST(req: NextRequest) {
    try {
        const { code } = await req.json();

        if (code === MASTER_KEYS.NORMAL) {
            return NextResponse.json({ success: true, type: 'NORMAL' });
        }
        if (code === MASTER_KEYS.VIP) {
            return NextResponse.json({ success: true, type: 'VIP' });
        }

        return NextResponse.json({ success: false }, { status: 401 });
    } catch (e) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
