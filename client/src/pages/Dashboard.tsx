import { useEffect, useState } from "react";
import { decrypt } from "../components/encrypt";
import Loading from "../components/Loading";
import Container from "../components/Container";
import client from "../components/axios";

export default function Dashboard() {
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState<"loading" | "success" | "error" | "invalid" | "timeout" | null>(null)
    const [statusMsg, setStatusMsg] = useState<string | null>(null)
    const [grades, setGrades] = useState<{ name: string, code: string, grade: string, assignments: any }[] | null>(null)
    async function fetchGrades(username: string, password: string): Promise<void> {
        return client.post("/getGrades", {
            username: username,
            password: password
        }).then((response) => {
            const data = response.data
            if (data.error) {
                if (data.errorCode === 1) {
                    setStatus("timeout")
                } else if (data.errorCode === 2) {
                    setStatus("invalid")
                }
            } else {
                setGrades(data.grades)
                setStatus("success")
            }
        }).catch((error) => {
            setStatus("error")
        })
    }
    useEffect(() => {
        const username = localStorage.getItem("username")
        const password = localStorage.getItem("password")
        if (username && password) {
            client.post("/verify", {
                username: decrypt(username),
                password: decrypt(password)
            }).then((res) => {
                if (res.data.error) {
                    if (res.data.errorCode === 1) {
                        setStatus("timeout")
                    } else if (res.data.errorCode === 2) {
                        setStatus("invalid")
                    }
                } else {
                    fetchGrades(decrypt(username), decrypt(password)).then(() => {
                        setLoading(false)
                    })
                }
            })
        } else {
            window.location.replace("/login")
        }
    }, [])

    return (
        <Container>
            {
                loading ? <Loading /> : (
                    <div>{grades?.map((item, index) => (
                        <div>
                            <h1>{item.name}</h1>
                            <h2>{item.code}</h2>
                            <h3>{item.grade}</h3>
                            <div>{item.assignments.map((assignment: any, index: number) => (
                                <div>
                                    <h1>{assignment.name}</h1>
                                </div>
                            ))}</div>
                        </div>
                    ))}</div>
                )
            }
        </Container>
    )
}