'use client'

import type { DirectionsResponseData, FindPlaceFromTextResponseData } from "@googlemaps/google-maps-services-js"
import { FormEvent, useRef, useState } from "react"
import { useMap } from "../hooks/useMap"

export default function NewRoutePage() {
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const map = useMap(mapContainerRef)
    const [directionsData, setDirectionsData] = useState<DirectionsResponseData & { request: any }>()

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
        setDirectionsData(directions)

        map?.removeAllRoutes()
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

    const createRoute = async() => {
        const { start_address, end_address } = directionsData!.routes[0].legs[0]

        const response = await fetch('http://localhost:3000/routes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: `${start_address} - ${end_address}`,
                source_id: directionsData!.request.origin.place_id,
                destination_id: directionsData!.request.destination.place_id
            })
        })
        const route = await response.json()
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
                {directionsData && 
                    <ul>
                        <li>Source {directionsData.routes[0].legs[0].start_address}</li>
                        <li>Destination {directionsData.routes[0].legs[0].end_address}</li>
                        <li>
                            <button onClick={createRoute}>
                                Create route
                            </button>
                        </li>
                    </ul>
                }
            </aside>
            <main id="map" ref={mapContainerRef} style={{height: '100%', width: '100%'}}>

            </main>
        </div>
    )
}