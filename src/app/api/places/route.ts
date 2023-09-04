import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const url = new URL(request.url)
    const text = url.searchParams.get('text')
    let data = {};
    try {
        const response = await fetch(`http://host.docker.internal:3000/places?text=${text}`, {
            next: {
                revalidate: 60
            }
        })
        data = await response.json()
    } catch(err) {
        console.error(err)
    }

    return NextResponse.json(data)
}