'use client'

import { Map, fetcher } from "@/app/core/utils"
import { Route } from "@/app/core/utils/model"
import { DirectionsResponseData } from "@googlemaps/google-maps-services-js"
import { Box, Typography, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material"
import { LoadingButton } from '@mui/lab'
import { FormEvent, useEffect, useState } from "react"
import RouteHint from "./RouteHint"
import useSwr from 'swr'
import { socket } from "@/app/core/utils/socket-io"

type Props = {
    map: Map | undefined
}
export const Sidebar = ({ map }: Props) => {
    const [isShipping, setIsShipping] = useState(false)
    const { data: routes, error, isLoading } = useSwr<Route[]>(`${process.env.NEXT_PUBLIC_API_URL}/routes`, fetcher, { fallbackData: [] })

    const startRoute = async(e: FormEvent) => {
        e.preventDefault()
        const routeId = (document.querySelector('#route') as HTMLSelectElement).value
        const route = await fetcher(`${process.env.NEXT_PUBLIC_API_URL}/routes/${routeId}`)

        setIsShipping(true)
        console.log(route)
        map?.removeAllRoutes()
        await map?.addRouteWithIcons({
            routeId: routeId,
            startMarkerOptions: {
                position: route.directions.routes[0].legs[0].start_location
            },
            endMarkerOptions: {
                position: route.directions.routes[0].legs[0].end_location
            },
            carMarkerOptions: {
                position: route.directions.routes[0].legs[0].start_location
            }
        })

        const { steps } = route.directions.routes[0].legs[0]

        for(const step of steps) {
            await new Promise(res => setTimeout(res, 2000))
            map?.moveCar(routeId, step.start_location)
            socket.emit('new-point', {
                route_id: routeId,
                lat: step.start_location.lat,
                lng: step.start_location.lng
            })

            await new Promise(res => setTimeout(res, 2000))
            map?.moveCar(routeId, step.end_location)
            socket.emit('new-point', {
                route_id: routeId,
                lat: step.end_location.lat,
                lng: step.end_location.lng
            })
        }

        setIsShipping(false)
    }

    useEffect(() => {
        socket.connect()
        return () => {
            socket.disconnect()
        }
    },[])

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
                gutterBottom
            >
                My Shipping
            </Typography>
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    rowGap: '1rem',
                    paddingBottom: '1rem'
                }}
                component={'form'}
                onSubmit={startRoute}
            >
                <FormControl>
                    <InputLabel id="route-select-label">Route</InputLabel>
                    <Select name="route" id="route" labelId="route-select-label">
                        <MenuItem value="" disabled>
                            {isLoading ? 'Loading routes...' : 'Select a route'}
                        </MenuItem>
                        {routes!.map(route => (
                            <MenuItem value={route.id} key={route.id}>
                                <Typography sx={{ textWrap: 'wrap' }}>{route.name}</Typography>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <LoadingButton loading={isLoading} disabled={isShipping} type="submit">Start shipping</LoadingButton>
            </Box>
        </Box>
    )
}

export default Sidebar
