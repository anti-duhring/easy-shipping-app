'use client'

import type { DirectionsResponseData, FindPlaceFromTextResponseData } from "@googlemaps/google-maps-services-js"
import { FormEvent, useRef } from "react"
import { useMap } from "../hooks/useMap"

export default function NewRoutePage() {
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const map = useMap(mapContainerRef)

    const searchPlaces = async(e: FormEvent) => {
        e.preventDefault()
        const source = (document.querySelector('#source') as HTMLInputElement).value
        const destination = (document.querySelector('#destination') as HTMLInputElement).value
        
        const [sourceResponse, destinationResponse] = await Promise.all([
            fetch(`http://localhost:3000/places?text=${source}`),
            fetch(`http://localhost:3000/places?text=${destination}`)
        ])
        const [sourcePlace, destinationPlace]: FindPlaceFromTextResponseData[] = await Promise.all([
            sourceResponse.json(),
            destinationResponse.json()
        ])
        
        if(sourcePlace.status !== 'OK' || destinationPlace.status !== 'OK') {
            console.error(sourcePlace)
            alert('Error fetching places')
            return 
        }

        const placeSourceId = sourcePlace.candidates[0].place_id
        const placeDestinationId = destinationPlace.candidates[0].place_id

        const directionsResponse = await fetch(`http://localhost:3000/directions?originId=${placeSourceId}&destinationId=${placeDestinationId}`)
        const directions: DirectionsResponseData & { request: any } = await directionsResponse.json()
        
        await map?.addRouteWithIcons({
            routeId: '1',
            startMarkerOptions: {
                position: directions.routes[0].legs[0].start_location
            },
            endMarkerOptions: {
                position: directions.routes[0].legs[0].end_location
            },
            carMarkerOptions: {
                position: directions.routes[0].legs[0].start_location
            }
        })
    }


    return (
        <div style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%'}}>
            <aside>
                <h1>New route</h1>
                <form 
                    style={{ display: 'flex', flexDirection: 'column'}}
                    onSubmit={searchPlaces}
                >
                    <input id="source" name="source" type="text" placeholder="source" />
                    <input id="destination" name="destination" type="text" placeholder="destination" />
                    <button type="submit">Create</button>
                </form>
            </aside>
            <main id="map" ref={mapContainerRef} style={{height: '100%', width: '100%'}}>

            </main>
        </div>
    )
}