import { Main } from "../features/newRoute"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'New route',
    description: 'Create a new route'
}

export default function NewRoutePage() {

    return (
        <Main />
    )
}