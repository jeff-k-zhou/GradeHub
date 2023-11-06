import client from "../axios";

export default async function fetchGrades(username: string, password: string, mp?: number) {
    if (mp) {
        const response = await client.post("/getGrades", {
            username: username,
            password: password,
            mp: mp
        })
        const data = response.data;
        if (data.error) {
            return {
                error: true,
                data: data.errorCode
            }
        } else {
            return {
                error: false,
                data: data
            }
        }
    } else {
        try {
            const response_1 = await client.post("/getGrades", {
                username: username,
                password: password
            });
            const data_2 = response_1.data;
            if (data_2.error) {
                return {
                    error: true,
                    data: data_2.errorCode
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