import Container from "../components/Container"
import { useEffect, useState } from "react"
import Loading from "../components/Loading"
import Nav from "../components/Nav"
import "../components/animations/fadeIn.css"

export default function Home() {
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        setLoading(false)
    }, [])
    return (
        <Container>
            {
                loading ? <Loading /> : (
                    <>
                        <div className="flex flex-col items-center w-full min-h-full">
                            <Nav active={-1} />
                            <div className="flex flex-col items-center justify-center w-full h-full">
                                <div className="w-full h-full bg-white flex flex-col items-center justify-center brightness-50">
                                    <img src="/icon.png" alt="logo" width={500} />
                                </div>
                                <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-white">
                                    <div className="w-full flex flex-col items-center gap-y-3 fadeIn">
                                        <h1 className="font-normal text-7xl">GradeHub</h1>
                                        <h2 className="text-xl">Beta Version</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </Container>
    )
}