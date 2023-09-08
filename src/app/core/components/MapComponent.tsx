'use client'

import { RefObject, useRef } from "react"

type Props = {
    componentRef: RefObject<HTMLDivElement>
}

export const MapComponent = ({ componentRef }: Props) => {
    return (
        <main id="map" ref={componentRef} style={{ flex: 4 }}>

        </main>
    )
}

export default MapComponent