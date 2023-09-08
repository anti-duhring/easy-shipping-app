'use client'

import { useMap } from "@/app/core/hooks"
import { useRef } from "react"
import { MapComponent } from "@/app/core/components"
import Sidebar from "./Sidebar"

export const Main = () => {
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const map = useMap(mapContainerRef)

    return (
        <div style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%'}}>
            <Sidebar map={map} />
            <MapComponent componentRef={mapContainerRef} />
        </div>
    )
}

export default Main