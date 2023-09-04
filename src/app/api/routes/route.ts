import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    let data = {};
    try {
        const response = await fetch(`http://host.docker.internal:3000/routes`, {
            next: {
                revalidate: 60,
                tags: ['routes']
            }
        })
        data = await response.json()
    } catch(err) {
        console.error(err)
    }

    return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
    let data = {};
    try {
        const response = await fetch(`http://host.docker.internal:3000/routes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(await request.json())
        })
        data = await response.json()
        revalidateTag('routes')
    } catch(err) {
        console.error(err)
    }

    return NextResponse.json(data)
}