import client from "../axios";

export default async function fetchGrades(username: string, password: string, cookies: any, mp?: number) {
    if (!cookies) {
        const response = await client.post("/auth/verify", {
            username: username,
            password: password
        })
        if (response.data.error) {
            return {
                error: true,
                data: "error"
            }
        } else {
            cookies = response.data.cookies
            sessionStorage.setItem("cookies", JSON.stringify(cookies))
        }
    }
    if (mp) {
        const response = await client.post("/grades/getGrades", {
            username: username,
            password: password,
            mp: mp,
            cookies: cookies,
        });
        const data = response.data;
        if (data.error) {
            if (data.errorCode === 1) {
                return {
                    error: true,
                    data: "timeout"
                }
            } else if (data.errorCode === 2) {
                return {
                    error: true,
                    data: "error"
                }
            } else if (data.errorCode === 3) {
                return await fetchGrades(username, password, null, mp)
            }
        } else {
            return {
                error: false,
                data: data
            }
        }
    } else {
        try {
            const response_1 = await client.post("/grades/getGrades", {
                username: username,
                password: password,
                cookies: cookies
            });
            const data_2 = response_1.data;
            if (data_2.error) {
                if (data_2.errorCode === 1) {
                    return {
                        error: true,
                        data: "timeout"
                    }
                } else if (data_2.errorCode === 2) {
                    return {
                        error: true,
                        data: "error"
                    }
                } else if (data_2.errorCode === 3) {
                    return await fetchGrades(username, password, null)
                }
            } else {
                return {
                    error: false,
                    data: data_2
                }
            }
        } catch {
            return {
                error: true,
                data: "error"
            }
        }
    }
    return {
        error: true,
        data: "error"
    }
}