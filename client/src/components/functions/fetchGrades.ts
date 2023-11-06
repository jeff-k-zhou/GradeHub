import client from "../axios";

export default async function fetchGrades(username: string, password: string, mp?: number) {
    if (mp) {
        const response = await client.post("/getGrades", {
            username: username,
            password: password,
            mp: mp
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
                return {
                    error: true,
                    data: "error"
                }
            } else {
                return {
                    error: true,
                    data: data.errorCode
                }
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
                    return {
                        error: true,
                        data: "error"
                    }
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