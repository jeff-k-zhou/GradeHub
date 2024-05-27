import express from 'express'
import cors from "cors"
import AuthRouter from './routes/auth'
import GradesRouter from './routes/grades'
import TranscriptRouter from './routes/transcript'
import GpaRouter from './routes/gpa'

const app = express()
app.use(express.json())
app.use(cors())

app.use("/grades", GradesRouter)
app.use("/auth", AuthRouter)
app.use("/transcript", TranscriptRouter)
app.use("/gpa", GpaRouter)

app.listen(process.env.PORT || 5000, () => console.log(`Server running on port ${process.env.PORT || 5000}`))

