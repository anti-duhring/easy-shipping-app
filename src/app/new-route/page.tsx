'use client'
import { useRef } from "react"
import { Sidebar } from "../features/newRoute"
import { useMap } from "../core/hooks"

export default function NewRoutePage() {
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const map = useMap(mapContainerRef)

    return (
        <div style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%'}}>
            <Sidebar map={map} />
            <main id="map" ref={mapContainerRef} style={{ flex: 4 }}>

            </main>
        </div>
    )
}