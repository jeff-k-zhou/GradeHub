import client from "../axios"

export default async function decrypt(username: string, password: string): Promise<any> {
    const response = await client.post("/auth/decrypt", {
        username: username,
        password: password
    })
    return response.data
}