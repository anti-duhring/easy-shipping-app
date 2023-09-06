'use client'

import type { DirectionsResponseData, FindPlaceFromTextResponseData } from "@googlemaps/google-maps-services-js"
import { FormEvent, useRef, useState } from "react"
import { Sidebar } from "../features/newRoute"
import { useMap } from "../core/hooks"

export default function NewRoutePage() {
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const map = useMap(mapContainerRef)

    // const createRoute = async() => {
    //     const { start_address, end_address } = directionsData!.routes[0].legs[0]

    //     const response = await fetch('http://localhost:3001/api/routes', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             name: `${start_address} - ${end_address}`,
    //             source_id: directionsData!.request.origin.place_id,
    //             destination_id: directionsData!.request.destination.place_id
    //         })
    //     })
    //     const route = await response.json()
    // }

    return (
        <div style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%'}}>
            <Sidebar map={map} />
            <main id="map" ref={mapContainerRef} style={{ flex: 4 }}>

            </main>
        </div>
    )
}