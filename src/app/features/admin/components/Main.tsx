'use client'

import { MapComponent } from "@/app/core/components"
import { useMap } from "@/app/core/hooks"
import { fetcher } from "@/app/core/utils"
import { Route } from "@/app/core/utils/model"
import { socket } from "@/app/core/utils/socket-io"
import { useEffect, useRef } from "react"

export const Main = () => {
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const map = useMap(mapContainerRef)

    useEffect(() => {
        socket.connect()
        socket.on('admin-new-point', async(data: { route_id: string, lat: number, lng: number }) => {
            if(!map?.hasRoute(data.route_id)) {
                const route: Route = await fetcher(`${process.env.NEXT_PUBLIC_API_URL}/routes/${data.route_id}`)
                map?.removeRoute(data.route_id)

                await map?.addRouteWithIcons({
                    routeId: data.route_id,
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
            }
            map?.moveCar(data.route_id, { lat: data.lat, lng: data.lng })
        })
        return () => {
            socket.disconnect()
        }
    },[map])

    return (
        <div style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%'}}>
            <MapComponent componentRef={mapContainerRef} />
        </div>
    )
}

export default Main