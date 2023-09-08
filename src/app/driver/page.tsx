import { Metadata } from "next"
import { Main } from "../features/driver"

export const metadata: Metadata = {
    title: 'Driver - My Shipping',
    description: 'Driver dashboard to start a new shipping!'
}

export default function DriverPage() {

    return (
        <Main />
    )
}