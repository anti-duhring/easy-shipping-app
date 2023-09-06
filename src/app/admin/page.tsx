'use client'

import { useEffect, useRef } from "react"
import { useMap } from "../hooks/useMap"
import { Route } from "../core/utils/model"
import { socket } from "../core/utils/socket-io"

export default function AdminPage() {
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const map = useMap(mapContainerRef)
    
    useEffect(() => {
        socket.connect()
        socket.on('admin-new-point', async(data: { route_id: string, lat: number, lng: number }) => {
            if(!map?.hasRoute(data.route_id)) {
                const response = await fetch(`http://localhost:3001/api/routes/${data.route_id}`)
                const route: Route = await response.json()
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
            <main id="map" ref={mapContainerRef} style={{height: '100%', width: '100%'}}>

            </main>
        </div>
    )
}