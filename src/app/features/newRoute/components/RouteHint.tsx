import { useSnackbar } from "@/app/core/hooks"
import { DirectionsResponseData } from "@googlemaps/google-maps-services-js"
import { LoadingButton } from "@mui/lab"
import { Button, Card, CardActions, CardContent, Typography } from "@mui/material"
import { useState } from "react"

type Props = {
    directions: DirectionsResponseData & { request: any }
}
export const RouteHint = ({ directions }: Props) => {
    const { Component: Snackbar, openSnackbar } = useSnackbar()
    const [isLoading, setIsLoading] = useState(false)
    const { start_address, end_address } = directions!.routes[0].legs[0]

    const createRoute = async() => {
        setIsLoading(true)

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/routes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: `${start_address} - ${end_address}`,
                source_id: directions!.request.origin.place_id,
                destination_id: directions!.request.destination.place_id
            })
        })
        const route = await response.json()

        setIsLoading(false)

        if(route.status !== 'OK') {
            openSnackbar('Error when creating route', 'error')
            return 
        }

        openSnackbar('Route created successfully!')
    }

    return (
        <>
            <Card>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary">
                        Source
                    </Typography>
                    <Typography gutterBottom>{start_address}</Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary">
                        Destination
                    </Typography>
                    <Typography>{end_address}</Typography>
                </CardContent>
                <CardActions>
                    <LoadingButton loading={isLoading} variant="text" onClick={createRoute}>
                        Create route
                    </LoadingButton>
                </CardActions>
            </Card>
            <Snackbar />
        </>
    )
}

export default RouteHint