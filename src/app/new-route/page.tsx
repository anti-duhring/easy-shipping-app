'use client'

import type { FindPlaceFromTextResponseData } from "@googlemaps/google-maps-services-js"
import { FormEvent } from "react"

export default function NewRoutePage() {
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
        const directions = await directionsResponse.json()
        
        console.log(directions) 
    }
    return (
        <div>
            <h1>New route</h1>
            <form 
                style={{ display: 'flex', flexDirection: 'column'}}
                onSubmit={searchPlaces}
            >
                <input id="source" name="source" type="text" placeholder="source" />
                <input id="destination" name="destination" type="text" placeholder="destination" />
                <button type="submit">Create</button>
            </form>
        </div>
    )
}