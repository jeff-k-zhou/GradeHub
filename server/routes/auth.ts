import express, { Request, Response } from 'express'
import aesjs from "aes-js"
import getSession from '../functions/getSession'

const AuthRouter = express.Router()

AuthRouter.post("/encrypt", (req: Request, res: Response) => {
    const key_256 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]

    const usernameBytes = aesjs.utils.utf8.toBytes(req.body.username)
    const passwordBytes = aesjs.utils.utf8.toBytes(req.body.password)

    const aesCtr = new aesjs.ModeOfOperation.ctr(key_256, new aesjs.Counter(5))
    const username = aesjs.utils.hex.fromBytes(aesCtr.encrypt(usernameBytes))
    const password = aesjs.utils.hex.fromBytes(aesCtr.encrypt(passwordBytes))

    res.json({
        username: username,
        password: password
    })
})

AuthRouter.post("/decrypt", (req: Request, res: Response) => {
    const key_256 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]

    const usernameBytes = aesjs.utils.hex.toBytes(req.body.username)
    const passwordBytes = aesjs.utils.hex.toBytes(req.body.password)

    const aesCtr = new aesjs.ModeOfOperation.ctr(key_256, new aesjs.Counter(5))
    const username = aesjs.utils.utf8.fromBytes(aesCtr.decrypt(usernameBytes))
    const password = aesjs.utils.utf8.fromBytes(aesCtr.decrypt(passwordBytes))

    res.json({
        username: username,
        password: password
    })
})

AuthRouter.post("/verify", (req: Request, res: Response) => {
    console.log("request received")
    getSession(req.body.username, req.body.password).then((credentials) => {
        if (credentials.error) {
            if (credentials.data = "invalid") {
                res.json({
                    error: true,
                    errorCode: 2
                })
            } else {
                res.json({
                    error: true,
                    errorCode: 1
                })
            }
        } else {
            res.json({
                error: false,
                cookies: credentials.cookies
            })
        }
    })
})

export default AuthRouter