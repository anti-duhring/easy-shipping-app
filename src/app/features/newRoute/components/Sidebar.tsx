'use client'

import { Map, fetcher } from "@/app/core/utils"
import { DirectionsResponseData } from "@googlemaps/google-maps-services-js"
import { Box, Typography, TextField } from "@mui/material"
import { LoadingButton } from '@mui/lab'
import { FormEvent, useState } from "react"
import RouteHint from "./RouteHint"

type Props = {
    map: Map | undefined
}
export const Sidebar = ({ map }: Props) => {
    const [directionsData, setDirectionsData] = useState<DirectionsResponseData & { request: any }>()
    const [isLoading, setIsLoading] = useState(false)

    const fetchPlaces = async(source: string, destination: string) => {
        const [sourcePlace, destinationPlace] = await Promise.all([
            fetcher(`${process.env.NEXT_PUBLIC_API_URL}/places?text=${source}`),
            fetcher(`${process.env.NEXT_PUBLIC_API_URL}/places?text=${destination}`)
        ])
        
        if(sourcePlace.status !== 'OK' || destinationPlace.status !== 'OK') {
            console.error(sourcePlace)
            alert('Error fetching places')
            return ['null', 'null']
        }

        const placeSourceId = sourcePlace.candidates[0].place_id
        const placeDestinationId = destinationPlace.candidates[0].place_id

        return [placeSourceId, placeDestinationId]
    }
    const searchPlaces = async(e: FormEvent) => {
        e.preventDefault()
        const source = (document.querySelector('#source') as HTMLInputElement).value
        const destination = (document.querySelector('#destination') as HTMLInputElement).value
        
        setIsLoading(true)
        const [placeSourceId, placeDestinationId] = await fetchPlaces(source, destination)
        const directions: DirectionsResponseData & { request: any } = await fetcher(`${process.env.NEXT_PUBLIC_API_URL}/directions?originId=${placeSourceId}&destinationId=${placeDestinationId}`)

        setDirectionsData(directions)
        setIsLoading(false)

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

    return (
        <Box 
            component={'aside'}
            sx={{
                flex: 1,
                padding: '1rem',
                backgroundColor: '#E2E2E2',
            }}
        >
            <Typography 
                variant="h4"
                sx={{ textAlign: 'center' }}
            >
                New route
            </Typography>
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    rowGap: '1rem',
                    paddingBottom: '1rem'
                }}
                component={'form'}
                onSubmit={searchPlaces}
            >
                <TextField id="source" name="source" label="Source" />
                <TextField id="destination" name="destination" label="Destination" />
                <LoadingButton loading={isLoading} type="submit">Create</LoadingButton>
            </Box>
            {directionsData && <RouteHint directions={directionsData} />}
        </Box>
    )
}

export default Sidebar
