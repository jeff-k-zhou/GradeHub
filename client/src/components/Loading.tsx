import { HashLoader } from "react-spinners"

export default function Loading() {
    return (
        <div className="flex grow h-full w-full items-center justify-center">
            <HashLoader />
        </div>
    )
}