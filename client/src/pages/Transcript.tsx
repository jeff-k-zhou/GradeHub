import fetchTranscript from "../components/functions/fetchTranscript"
import { useEffect, useState } from "react"
import Nav from "../components/Nav"
import Container from "../components/Container"
import { useNavigate } from "react-router-dom"
import decrypt from "../components/functions/decrypt"
import Loading from "../components/Loading"
import { Divider, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Button } from "@nextui-org/react"
import { ArrowClockwise } from "react-bootstrap-icons"

export default function Transcript() {
    const navigate = useNavigate()
    const [headers, setHeaders] = useState<any[]>([])
    const [data, setData] = useState<any>([[]])
    const [footers, setFooters] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [gpa, setGpa] = useState<any>({})
    const [rank, setRank] = useState<string>("")
    const [error, setError] = useState(false)
    const [count, setCount] = useState(0)
    useEffect(() => {
        setLoading(true)
        setError(false)
        if (!localStorage.getItem("username") || !localStorage.getItem("password")) {
            navigate("/login")
        } else {
            if (sessionStorage.getItem("transcript")) {
                let transcript = JSON.parse(sessionStorage.getItem("transcript")!)
                setHeaders(transcript.headers)
                setData(transcript.data)
                setFooters(transcript.footers)
                setGpa(transcript.gpa)
                setRank(transcript.rank)
                setLoading(false)
            } else {
                let cookies = window.sessionStorage.getItem("cookies") ? JSON.parse(window.sessionStorage.getItem("cookies")!) : null
                decrypt(localStorage.getItem("username")!, localStorage.getItem("password")!).then((decryptedInfo: any) => {
                    fetchTranscript(decryptedInfo.username, decryptedInfo.password, cookies).then((transcript: any) => {
                        if (transcript.error) {
                            setError(true)
                            console.log("error")
                        } else {
                            setHeaders(transcript.data.headers)
                            setData(transcript.data.data)
                            setFooters(transcript.data.footers)
                            setGpa(transcript.data.gpa)
                            setRank(transcript.data.rank)
                            setLoading(false)
                            setError(false)
                            sessionStorage.setItem("transcript", JSON.stringify(transcript.data))
                        }
                    })
                })
            }
        }
    }, [count])
    if (error) {
        return (
            <Container>
                <Nav active={0} />
                <div className="w-full h-full flex flex-col items-center justify-center gap-y-4">
                    <h1 className="font-normal text-xl w-5/6 text-center">There was an error fetching your grades.</h1>
                    <Button color="primary" onClick={() => {
                        setCount(prevCount => prevCount + 1)
                    }}>
                        <ArrowClockwise size={20} />
                        Retry
                    </Button>
                </div>
            </Container>
        )
    }
    return (
        <Container>
            <Nav active={2} />
            {
                loading ? <Loading /> : (
                    <>
                        <div className="flex flex-col lg:flex-row justify-center flex-wrap">
                            {
                                data.map((table: any, index: number) => (
                                    <div key={index} className="flex flex-col items-center p-10 w-full lg:w-1/2">
                                        <div className="w-full flex flex-col pb-5">
                                            <div className="flex flex-row w-full justify-between">
                                                <p>Year: {headers[index].year}</p>
                                                <p>Grade: {headers[index].grade}</p>
                                            </div>
                                            <div>
                                                <p>Building: {headers[index].building}</p>
                                            </div>
                                        </div>
                                        <Table key={index}>
                                            <TableHeader>
                                                <TableColumn>Course</TableColumn>
                                                <TableColumn>Description</TableColumn>
                                                <TableColumn>Sem1</TableColumn>
                                                <TableColumn>Sem2</TableColumn>
                                                <TableColumn>Fin</TableColumn>
                                                <TableColumn>Credits</TableColumn>
                                            </TableHeader>
                                            <TableBody>
                                                {
                                                    table.map((row: any, index: number) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{row.course}</TableCell>
                                                            <TableCell>{row.description}</TableCell>
                                                            <TableCell>{row.sem1}</TableCell>
                                                            <TableCell>{row.sem2}</TableCell>
                                                            <TableCell>{row.fin}</TableCell>
                                                            <TableCell>{row.credits}</TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                            </TableBody>
                                        </Table>
                                        <p className="self-end pt-5">Credits: {footers[index]}</p>
                                        <Divider className="mt-5" />
                                    </div>
                                ))
                            }
                        </div>
                        <Table className="px-5 pb-5 w-full lg:w-1/2">
                            <TableHeader>
                                <TableColumn>Cumulative GPA</TableColumn>
                                <TableColumn>Rank</TableColumn>
                                <TableColumn>Unweighted GPA</TableColumn>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>{gpa.weighted}</TableCell>
                                    <TableCell>{rank}</TableCell>
                                    <TableCell>{gpa.unweighted}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </>
                )
            }
        </Container >
    )
}