'use client'

import { FormEvent, useEffect, useRef } from "react"
import { useMap } from "../hooks/useMap"
import useSwr from 'swr'
import { fetcher } from "../core/utils"
import { Route } from "../core/utils/model"
import { socket } from "../core/utils/socket-io"

export default function DriverPage() {
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const map = useMap(mapContainerRef)
    const { data: routes, error, isLoading } = useSwr<Route[]>('http://localhost:3001/api/routes', fetcher, { fallbackData: [] })

    const startRoute = async(e: FormEvent) => {
        e.preventDefault()
        const routeId = (document.querySelector('#route') as HTMLSelectElement).value
        const response = await fetch(`http://localhost:3001/api/routes/${routeId}`)
        const route: Route = await response.json()

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
    }
    
    useEffect(() => {
        socket.connect()
        return () => {
            socket.disconnect()
        }
    },[])

    return (
        <div style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%'}}>
            <aside>
                <h1>My shipping</h1>
                <form 
                    style={{ display: 'flex', flexDirection: 'column'}}
                    onSubmit={startRoute}
                >
                    <select name="route" id="route">
                        {isLoading && <option>Loading routes...</option>}
                        {routes!.map(route => (
                            <option value={route.id} key={route.id}>
                                {route.name}
                            </option>
                        ))}
                    </select>
                    <button type="submit">Start shipping</button>
                </form>
                
            </aside>
            <main id="map" ref={mapContainerRef} style={{height: '100%', width: '100%'}}>

            </main>
        </div>
    )
}