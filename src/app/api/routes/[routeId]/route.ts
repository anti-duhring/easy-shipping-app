import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { routeId: string } }) {
    let data = {};
    const id = params.routeId
    try {
        const response = await fetch(`http://host.docker.internal:3000/routes/${id}`, {
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