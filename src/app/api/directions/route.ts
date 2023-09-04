import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const url = new URL(request.url)
    const originId = url.searchParams.get('originId')
    const destinationId = url.searchParams.get('destinationId')
    let data = {};
    try {
        const response = await fetch(`http://host.docker.internal:3000/directions?originId=${originId}&destinationId=${destinationId}`, {
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