
type Props = {
    startAddress: string,
    endAddress: string,
    createRoute: () => void
}
export const RouteHint = ({ startAddress, endAddress, createRoute }: Props) => {
    return (
        <ul>
            <li>Source {startAddress}</li>
            <li>Destination {endAddress}</li>
            <li>
                <button onClick={createRoute}>
                    Create route
                </button>
            </li>
        </ul>
    )
}

export default RouteHint