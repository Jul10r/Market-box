import { ablyRest } from "@/lib/ably";
import { syncCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    const user = await syncCurrentUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tokenRequestData = await ablyRest.auth.createTokenRequest({
        clientId: user.id
    })

    return NextResponse.json(tokenRequestData)
}