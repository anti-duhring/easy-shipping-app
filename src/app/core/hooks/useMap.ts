import { Loader } from "@googlemaps/js-api-loader";
import React, { useEffect, useState } from "react";
import { Map, getCurrentPosition } from "../utils";

export function useMap(containerRef: React.RefObject<HTMLDivElement>) {
    const [map, setMap] = useState<Map>()

    const fetchGoogleMapsLoader = async() => {
        const loader = new Loader({
            libraries: ['routes', 'geometry'],
            apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string
        })
        const [routesLib, geometryLib, position] = await Promise.all([
            loader.importLibrary('routes'),
            loader.importLibrary('geometry'),
            getCurrentPosition({ enableHighAccuracy: true })
        ])

        const map = new Map(containerRef.current!, {
            zoom: 15,
            center: position
        })

        setMap(map)
    }

    useEffect(() => {
        fetchGoogleMapsLoader()
    }, [])

    return map
}