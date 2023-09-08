
import { Metadata } from "next"
import { Main } from "../features/admin"

export const metadata: Metadata = {
    title: 'Admin - Manage All Shippings'
}

export default function AdminPage() {
    return (
        <Main />
    )
}