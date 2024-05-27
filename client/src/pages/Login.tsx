import client from "../components/axios";
import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import Container from "../components/Container";
import Nav from "../components/Nav";
import { Input, Button, Card, CardHeader } from "@nextui-org/react"
import { Eye, EyeSlash } from "react-bootstrap-icons"
import { useNavigate } from "react-router-dom";

export default function Login() {
    const Navigate = useNavigate()
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(true)
    const [visible, setVisible] = useState<boolean>(false)
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
            window.location.replace("/grades")
        } else {
            setLoading(false)
        }
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
        } else {
            client.post("/auth/verify", {
                username: username,
                password: password
            }).then((response) => {
                const data = response.data
                if (data.error) {
                    setVerifying(false)
                    if (data.errorCode === 1) {
                        setStatusError({
                            error: true,
                            msg: "HAC is not responding. Please try again later."
                        })
                    } else if (data.errorCode === 2) {
                        setStatusError({
                            error: true,
                            msg: "Invalid username or password"
                        })
                    }
                } else {
                    sessionStorage.setItem("cookies", JSON.stringify(response.data.cookies))
                    client.post("/auth/encrypt", {
                        username: username,
                        password: password
                    }).then((res) => {
                        localStorage.setItem("username", res.data.username)
                        localStorage.setItem("password", res.data.password)
                        Navigate("/grades")
                    }).catch(() => {
                        setVerifying(false)
                        setStatusError({
                            error: true,
                            msg: "Couldn't contact server"
                        })
                    })
                }
            }).catch(() => {
                setVerifying(false)
                console.error("couldn't contact server")
            })
        }
    }

    return (
        <Container>
            <Nav active={-1} />
            {
                loading ? <Loading /> : (
                    <>
                        <div className="flex flex-col items-center justify-center h-full w-full gap-y-6" onKeyDown={(key) => {
                            if (key.key === "Enter") {
                                handleSubmit()
                            }
                        }}>
                            <h1 className="text-5xl">HAC Login</h1>
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
                                isDisabled={verifying}
                                size="lg"
                            />
                            <Input
                                label="Password"
                                type={visible ? "text" : "password"}
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
                                isDisabled={verifying}
                                size="lg"
                                endContent={
                                    visible ? (
                                        <EyeSlash
                                            size={24}
                                            className="cursor-pointer"
                                            onClick={() => setVisible(false)}
                                        />
                                    ) : (
                                        <Eye
                                            size={24}
                                            className="cursor-pointer"
                                            onClick={() => setVisible(true)}
                                        />
                                    )
                                }
                            />
                            <Card className={`bg-red-500 text-white w-5/6 lg:w-1/2 ${!statusError.error ? "hidden" : ""}`}>
                                <CardHeader>{statusError.msg}</CardHeader>
                            </Card>
                            <Button
                                color="primary"
                                className="w-5/6 lg:w-1/2"
                                isLoading={verifying}
                                onClick={handleSubmit}
                                size="lg"
                            >
                                {verifying ? "" : "Login"}
                            </Button>
                        </div>
                    </>
                )
            }
        </Container>
    )
}