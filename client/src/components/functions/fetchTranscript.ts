import client from "../axios"

export default async function fetchTranscript(username: string, password: string, cookies: any): Promise<any> {
    try {
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
        const response = await client.post("/transcript/getTranscript", {
            username: username,
            password: password,
            cookies: cookies
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
                return await fetchTranscript(username, password, null)
            }
        } else {
            let totalCredits = 0
            for (let i = 0; i < data.footers.length; i++) {
                totalCredits += Number(data.footers[i])
            }
            sessionStorage.setItem("totalCredits", totalCredits.toString())
            sessionStorage.setItem("totalGpa", data.gpa.weighted)
            return {
                error: false,
                data: data
            }
        }
    } catch (error) {
        return {
            error: true,
            data: "error"
        }
    }
}