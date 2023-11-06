import Container from "../components/Container"
import Loading from "../components/Loading"
import Nav from "../components/Nav"
import { Card, CardBody, Progress, Skeleton } from "@nextui-org/react"
import { useEffect, useState } from "react"
import calculateGPA from "../components/functions/calculateGPA"
import unweightedGPA from "../components/functions/unweightedGPA"
import fetchGrades from "../components/functions/fetchGrades"
import client from "../components/axios"

export default function GPA() {
    const [loading, setLoading] = useState(true)
    const [calculating, setCalculating] = useState(true)
    const [weighted, setWeighted] = useState<string>('N/A')
    const [unweighted, setUnweighted] = useState<string>('N/A')
    const grades = [
        window.sessionStorage.getItem("1") ? JSON.parse(window.sessionStorage.getItem("1")!) : null,
        window.sessionStorage.getItem("2") ? JSON.parse(window.sessionStorage.getItem("2")!) : null,
        window.sessionStorage.getItem("3") ? JSON.parse(window.sessionStorage.getItem("3")!) : null,
        window.sessionStorage.getItem("4") ? JSON.parse(window.sessionStorage.getItem("4")!) : null
    ]
    useEffect(() => {
        const username = localStorage.getItem("username")
        const password = localStorage.getItem("password")
        if (username && password) {
            setLoading(false)
            if (grades[Number(window.sessionStorage.getItem("mp")!) - 1]) {
                const weighted = calculateGPA(grades[Number(window.sessionStorage.getItem("mp")!) - 1], Number(window.sessionStorage.getItem("mp")!))
                const unweighted = unweightedGPA(grades[Number(window.sessionStorage.getItem("mp")!) - 1])
                if (weighted !== -1 && unweighted !== -1) {
                    setWeighted(weighted)
                    setUnweighted(unweighted)
                } else {
                    setWeighted("N/A")
                    setUnweighted("N/A")
                }
                setCalculating(false)

            } else {
                client.post("/decrypt", {
                    username: username,
                    password: password
                }).then((decryptedInfo) => {
                    fetchGrades(decryptedInfo.data.username, decryptedInfo.data.password).then((grades) => {
                        if (grades.error) {
                            console.log(grades.data)
                        } else {
                            const weighted = calculateGPA(grades.data.grades, Number(grades.data.mp))
                            const unweighted = unweightedGPA(grades.data.grades)
                            if (weighted !== -1 && unweighted !== -1) {
                                setWeighted(weighted)
                                setUnweighted(unweighted)
                            } else {
                                setWeighted("N/A")
                                setUnweighted("N/A")
                            }
                            setCalculating(false)
                        }
                    })
                })
            }
        } else {
            window.location.replace("/")
        }
    }, [])

    if (loading) {
        return <Container><Loading /></Container>
    } else {
        return (
            <Container>
                <Nav active={1} />
                <div className="w-full flex flex-col items-center justify-center mt-10">
                    <div className="w-5/6 flex flex-col md:flex-row justify-center gap-y-3 md:gap-y-0 md:gap-x-10">
                        <Card className="w-full md:w-1/2">
                            <CardBody>
                                <h1 className="text-lg">Weighted GPA:</h1>
                                <Skeleton className="rounded-md w-1/2 mt-1" isLoaded={!calculating}>
                                    <h1 className="text-4xl">{weighted}</h1>
                                </Skeleton>
                                { /* @ts-ignore */}
                                <Progress size="lg" color={typeof weighted !== "string" ? "primary" : weighted > 5 ? "primary" : weighted > 4 ? "secondary" : weighted > 3 ? "warning" : "danger"} value={weighted} maxValue={6} className="mt-3" />
                            </CardBody>
                        </Card>
                        <Card className="w-full md:w-1/2">
                            <CardBody>
                                <h1 className="text-lg">Unweighted GPA:</h1>
                                <Skeleton className="rounded-md w-1/2 mt-1" isLoaded={!calculating}>
                                    <h1 className="text-4xl">{unweighted}</h1>
                                </Skeleton>
                                { /* @ts-ignore */}
                                <Progress size="lg" color={typeof unweighted !== "string" ? "primary" : unweighted > 3.5 ? "primary" : unweighted > 3 ? "secondary" : unweighted > 2 ? "warning" : "danger"} value={unweighted} maxValue={4} className="mt-3" />
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </Container>
        )
    }
}