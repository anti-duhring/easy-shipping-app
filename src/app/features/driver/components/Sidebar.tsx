'use client'

import { Map, automateTravel, fetcher } from "@/app/core/utils"
import { Route } from "@/app/core/utils/model"
import { Box, Typography, TextField, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from "@mui/material"
import { LoadingButton } from '@mui/lab'
import { FormEvent, useEffect, useState } from "react"
import RouteHint from "./RouteHint"
import useSwr from 'swr'
import { socket } from "@/app/core/utils/socket-io"
import { useSnackbar } from "@/app/core/hooks"

type Props = {
    map: Map | undefined
}
export const Sidebar = ({ map }: Props) => {
    const [isShipping, setIsShipping] = useState(false)
    const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null)
    const { Component: Snackbar, openSnackbar } = useSnackbar()
    const { data: routes, error, isLoading } = useSwr<Route[]>(`${process.env.NEXT_PUBLIC_API_URL}/routes`, fetcher, { fallbackData: [] })

    const startRoute = async(e: FormEvent) => {
        e.preventDefault()
        if(!selectedRouteId) return 
        if(!map) return

        const route = await fetcher(`${process.env.NEXT_PUBLIC_API_URL}/routes/${selectedRouteId}`)

        setIsShipping(true)

        map.removeAllRoutes()
        await map.addRouteWithIcons({
            routeId: selectedRouteId,
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

        await automateTravel(selectedRouteId, steps, map, (data) => socket.emit('new-point', data))
        openSnackbar('Ship finished!')
        setIsShipping(false)
    }

    const handleSelectChange = (e: SelectChangeEvent) => {
        setSelectedRouteId(e.target.value as string)
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
                    <Select 
                        name="route" 
                        id="route" 
                        labelId="route-select-label"
                        value={selectedRouteId ?? ''}
                        onChange={handleSelectChange}
                    >
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
                <LoadingButton 
                    loading={isLoading} 
                    disabled={isShipping || !selectedRouteId}
                    type="submit"
                >
                    Start shipping
                </LoadingButton>
            </Box>
            <Snackbar />
        </Box>
    )
}

export default Sidebar
