import { NextResponse } from "next/server";
import { getAthlete } from "@/firebase/database";

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || '';
    if (!cookie.includes('scm-user-role=admin')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { athleteId, docKey } = body as { athleteId?: string; docKey?: string };

    if (!athleteId || !docKey) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    const athlete = await getAthlete(athleteId);
    if (!athlete) return NextResponse.json({ message: 'Athlete not found' }, { status: 404 });

    const doc = (athlete.documents || {})[docKey as keyof typeof athlete.documents];
    if (!doc) return NextResponse.json({ message: 'Document not found' }, { status: 404 });

    return NextResponse.json({ url: doc.storageUrl });
  } catch (err: any) {
    console.error('Download API error', err);
    return NextResponse.json({ message: err?.message || 'Server error' }, { status: 500 });
  }
}
