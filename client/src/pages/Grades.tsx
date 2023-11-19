import { useState, useEffect, useRef } from "react"
import client from "../components/axios"
import fetchGrades from "../components/functions/fetchGrades"
import Container from "../components/Container"
import Loading from "../components/Loading"
import Nav from "../components/Nav"
import { Card, CardBody, Tabs, Tab, Button } from "@nextui-org/react"
import ProgressProvider from "../components/ProgressBar"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import { ArrowClockwise } from "react-bootstrap-icons"
import DetailedView from "../components/DetailedView"
import "../components/animations/slide.css"

export default function Grades() {
    const [loading, setLoading] = useState(true)
    const [fetching, setFetching] = useState(true)
    const [grades, setGrades] = useState<any[]>([
        window.sessionStorage.getItem("1") ? JSON.parse(window.sessionStorage.getItem("1")!) : null,
        window.sessionStorage.getItem("2") ? JSON.parse(window.sessionStorage.getItem("2")!) : null,
        window.sessionStorage.getItem("3") ? JSON.parse(window.sessionStorage.getItem("3")!) : null,
        window.sessionStorage.getItem("4") ? JSON.parse(window.sessionStorage.getItem("4")!) : null
    ])
    const [detailed, setDetailed] = useState(false)
    const [index, setIndex] = useState(0)
    const [error, setError] = useState(false)
    const [selected, setSelected] = useState<any>(window.sessionStorage.getItem("mp"))
    const [scrollX, setScrollX] = useState(0)
    const [scrollY, setScrollY] = useState(0)
    const ref = useRef<HTMLDivElement>(null)
    const mp = ["MP1", "MP2", "MP3", "MP4"]
    useEffect(() => {
        if (window.localStorage.getItem("username") && window.localStorage.getItem("password")) {
            if (window.sessionStorage.getItem(window.sessionStorage.getItem("mp")!)) {
                console.log(JSON.parse(window.sessionStorage.getItem(window.sessionStorage.getItem("mp")!)!))
                setLoading(false)
                setFetching(false)
            } else {
                client.post("/decrypt", {
                    username: window.localStorage.getItem("username"),
                    password: window.localStorage.getItem("password")
                }).then((response) => {
                    setLoading(false)
                    fetchGrades(response.data.username, response.data.password).then((data) => {
                        if (data.error) {
                            setError(true)
                            console.log(data.data)
                        } else {
                            window.sessionStorage.setItem(data.data.mp, JSON.stringify(data.data.grades))
                            setGrades(prevState => [
                                ...prevState.slice(0, data.data.mp - 1),
                                data.data.grades,
                                ...prevState.slice(data.data.mp)

                            ])
                            setSelected(data.data.mp)
                            window.sessionStorage.setItem("mp", data.data.mp)
                        }
                        for (let i = 0; i < 4; i++) {
                            if (!window.sessionStorage.getItem((i + 1).toString())) {
                                fetchGrades(response.data.username, response.data.password, (i + 1)).then((grades) => {
                                    if (grades.error) {
                                        console.log(grades.data)
                                    } else {
                                        window.sessionStorage.setItem(grades.data.mp, JSON.stringify(grades.data.grades))
                                    }
                                })
                            }
                        }
                        setFetching(false)
                    })
                })
            }
        } else {
            window.location.replace("/login")
        }
    }, [])

    const handleSelect = async (key: any) => {
        setSelected(key)
        setGrades(prevState => [
            ...prevState.slice(0, key - 1),
            null,
            ...prevState.slice(key)
        ])
        if (window.sessionStorage.getItem(key)) {
            return "success"
        } else {
            const decryptedInfo = await client.post("/decrypt", {
                username: window.localStorage.getItem("username"),
                password: window.localStorage.getItem("password")
            })

            const grades = await fetchGrades(decryptedInfo.data.username, decryptedInfo.data.password, key)
            if (grades.error) {
                console.log(grades.data)
                return "error"
            } else {
                window.sessionStorage.setItem(grades.data.mp, JSON.stringify(grades.data.grades))
                return "success"
            }
        }
    }

    const handleErrorRefresh = async () => {
        setError(false)
        setFetching(true)
        const decryptedInfo = await client.post("/decrypt", {
            username: window.localStorage.getItem("username"),
            password: window.localStorage.getItem("password")
        })

        const grades = await fetchGrades(decryptedInfo.data.username, decryptedInfo.data.password)
        if (grades.error) {
            console.log(grades.data)
            setFetching(false)
            setError(true)
        } else {
            window.sessionStorage.setItem(grades.data.mp, JSON.stringify(grades.data.grades))
            window.sessionStorage.setItem("mp", grades.data.mp)
            setGrades(prevState => [
                ...prevState.slice(0, Number(grades.data.mp) - 1),
                grades.data.grades,
                ...prevState.slice(Number(grades.data.mp))
            ])
            setFetching(false)
        }
    }

    const handleRefresh = async () => {
        setGrades(prevState => [
            ...prevState.slice(0, Number(selected) - 1),
            null,
            ...prevState.slice(Number(selected))
        ])
        const decryptedInfo = await client.post("/decrypt", {
            username: window.localStorage.getItem("username"),
            password: window.localStorage.getItem("password")
        })

        const grades = await fetchGrades(decryptedInfo.data.username, decryptedInfo.data.password)
        if (grades.error) {
            console.log(grades.data)
            return "error"
        } else {
            window.sessionStorage.setItem(grades.data.mp, JSON.stringify(grades.data.grades))
            return "success"
        }
    }

    if (loading) {
        return <Container><Loading /></Container>
    } else if (error) {
        return (
            <Container>
                <Nav active={0} />
                <div className="w-full h-full flex flex-col items-center justify-center gap-y-4">
                    <h1 className="font-normal text-xl">There was an error fetching your grades.</h1>
                    <Button color="primary" onClick={handleErrorRefresh}>
                        <ArrowClockwise size={20} />
                        Retry
                    </Button>
                </div>
            </Container>
        )
    } else {
        return (
            <Container>
                <Nav active={0} />
                <DetailedView grades={grades} index={selected - 1} class={index} hidden={!detailed} toggle={setDetailed} scrollX={scrollX} scrollY={scrollY} />
                <div hidden={detailed} ref={ref} className="w-full h-full mt-5">
                    {
                        fetching ? <Loading /> : (
                            <div className="flex flex-col items-center h-full w-full">
                                <Tabs selectedKey={selected} variant="bordered" color="primary" onSelectionChange={(key) => {
                                    handleSelect(key).then((response) => {
                                        if (response === "success") {
                                            setGrades(prevState => [
                                                ...prevState.slice(0, key.valueOf() as number - 1),
                                                JSON.parse(window.sessionStorage.getItem(key.toString())!),
                                                ...prevState.slice(key.valueOf() as number)
                                            ])
                                        } else {
                                            setError(true)
                                        }
                                    })
                                }}>
                                    {
                                        mp.map((item, index) => (
                                            <Tab key={index + 1} title={item} className="w-full h-full">
                                                {!grades[selected - 1] ?
                                                    <Loading />
                                                    :
                                                    <>
                                                        <div className="w-full flex flex-col items-center">
                                                            <div className="w-3/4 flex flex-col">
                                                                <Button className="self-end" isIconOnly color="primary" onClick={() => {
                                                                    handleRefresh().then((response) => {
                                                                        if (response === "success") {
                                                                            setGrades(prevState => [
                                                                                ...prevState.slice(0, selected.valueOf() as number - 1),
                                                                                JSON.parse(window.sessionStorage.getItem(selected.toString())!),
                                                                                ...prevState.slice(selected.valueOf() as number)
                                                                            ])
                                                                        } else {
                                                                            setError(true)
                                                                        }
                                                                    })
                                                                }}>
                                                                    <ArrowClockwise size={20} />
                                                                </Button>
                                                            </div>
                                                            <div className="flex flex-row flex-wrap justify-center gap-5 mt-5">
                                                                {
                                                                    grades[selected - 1].map((grade: any, index: number) => (
                                                                        <Card key={index} className="w-5/6 md:w-1/3 lg:w-1/4 cursor-pointer">
                                                                            <CardBody className="w-full items-center justify-center py-5" onClick={() => {
                                                                                setScrollX(window.scrollX)
                                                                                setScrollY(window.scrollY)
                                                                                setIndex(index)
                                                                                setDetailed(true)
                                                                                window.scrollTo(0, 0)
                                                                                ref.current?.classList.add("slideRight")
                                                                            }} aria-label="View Grades" role="button">
                                                                                <h1 className="font-normal text-xl text-center text-ellipsis whitespace-nowrap w-full overflow-hidden">
                                                                                    {grade.name}
                                                                                </h1>
                                                                                <h2>{grade.code}</h2>
                                                                                <div className="w-3/5 mt-5">
                                                                                    <ProgressProvider valueStart={0} valueEnd={Number(grade.grade) || 0}>
                                                                                        {(value) => (
                                                                                            <>
                                                                                                <CircularProgressbar
                                                                                                    value={value}
                                                                                                    styles={buildStyles({
                                                                                                        pathColor: Number(grade.grade) >= 90 ? "#006FEE" : Number(grade.grade) >= 80 ? "#7828c8" : Number(grade.grade) >= 70 ? "#f5a524" : "#f31260",
                                                                                                        textColor: "black",
                                                                                                        pathTransitionDuration: 0.8
                                                                                                    })}
                                                                                                    text={`${(Number(grade.grade) || 0).toFixed(2)}%`}
                                                                                                />
                                                                                            </>
                                                                                        )}
                                                                                    </ProgressProvider>
                                                                                </div>
                                                                            </CardBody>
                                                                        </Card>
                                                                    ))
                                                                }
                                                            </div>
                                                        </div>
                                                    </>
                                                }
                                                <div className="h-5"></div>
                                            </Tab>
                                        ))
                                    }
                                </Tabs>
                            </div>
                        )
                    }
                </div>
            </Container>
        )
    }
}