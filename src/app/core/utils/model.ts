import type { DirectionsResponseData } from "@googlemaps/google-maps-services-js";

export type Route = {
    source: { name: string; } & { location: { lat: number; lng: number; }; };
    destination: { name: string; } & { location: { lat: number; lng: number; }; };
    name: string;
    distance: number;
    duration: number;
    created_at: Date;
    updated_at: Date;
    id: string;
    directions: DirectionsResponseData & { request: any }
}