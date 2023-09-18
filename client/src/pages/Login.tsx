import client from "../components/axios";
import { encrypt } from "../components/encrypt";
import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import Container from "../components/Container";
import Nav from "../components/Nav";
import { Input, Button, Card, CardBody } from "@nextui-org/react"

export default function Login() {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState({
        username: {
            error: false,
            msg: ""
        },
        password: {
            error: false,
            msg: ""
        }
    })
    const [statusError, setStatusError] = useState({
        error: false,
        msg: ""
    })
    const [verifying, setVerifying] = useState<boolean>(false)
    useEffect(() => {
        const username = localStorage.getItem("username")
        const password = localStorage.getItem("password")
        if (username && password) {
            window.location.replace("/dashboard")
        }
        setLoading(false)
    }, [])
    function validate() {
        let valid = true
        if (username.length === 0) {
            setError(prevError => ({
                ...prevError,
                username: {
                    error: true,
                    msg: "Username cannot be empty"
                }
            }))
            valid = false
        }
        if (password.length === 0) {
            setError(prevError => ({
                ...prevError,
                password: {
                    error: true,
                    msg: "Password cannot be empty"
                }
            }))
            valid = false
        }
        return valid
    }
    function handleSubmit() {
        setVerifying(true)
        if (!validate()) {
            setVerifying(false)
            return
        }
        client.post("/verify", {
            username: username,
            password: password
        }).then((response) => {
            setVerifying(false)
            const data = response.data
            if (data.error) {
                if (data.errorCode === 1) {
                    console.error("timeout")
                } else if (data.errorCode === 2) {
                    console.error("username/password invalid")
                }
            } else {
                localStorage.setItem("username", encrypt(username))
                localStorage.setItem("password", encrypt(password))
                window.location.replace("/dashboard")
            }
        }).catch(() => {
            setVerifying(false)
            console.error("couldn't contact server")
        })
    }

    return (
        <Container>
            <Nav logged={false} />
            {
                loading ? <Loading /> : (
                    <>
                        <div className="flex flex-col items-center justify-center h-full w-full gap-y-6">
                            <Input
                                label="Username"
                                type="text"
                                variant="bordered"
                                value={username}
                                onChange={(e) => {
                                    setError(prevError => ({
                                        ...prevError,
                                        username: {
                                            error: false,
                                            msg: ""
                                        }
                                    }))
                                    setUsername(e.target.value)
                                }}
                                className="w-5/6 lg:w-1/2"
                                isInvalid={error.username.error}
                                errorMessage={error.username.msg}
                            />
                            <Input
                                label="Password"
                                type="password"
                                variant="bordered"
                                value={password}
                                onChange={(e) => {
                                    setError(prevError => ({
                                        ...prevError,
                                        password: {
                                            error: false,
                                            msg: ""
                                        }
                                    }))
                                    setPassword(e.target.value)
                                }}
                                className="w-5/6 lg:w-1/2"
                                isInvalid={error.password.error}
                                errorMessage={error.password.msg}
                            />
                            <Button
                                color="primary"
                                className="w-5/6 lg:w-1/2"
                                isLoading={verifying}
                                onClick={handleSubmit}
                            >
                                { verifying ? "" : "Login" }
                            </Button>
                        </div>
                        <Card hidden={!statusError.error} className="bg-red-500 text-white">
                            <CardBody>{statusError.msg}</CardBody>
                        </Card>
                    </>
                )
            }
        </Container>
    )
}