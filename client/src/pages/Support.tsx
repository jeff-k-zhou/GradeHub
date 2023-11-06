import Container from "../components/Container"
import Nav from "../components/Nav"

export default function Support() {
    return (
        <Container>
            <Nav active={2} />
            <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="w-5/6 md:w-3/4 lg:w-3/5 flex flex-col items-center gap-y-5">
                    <h1 className="text-5xl">Have a bug or some feedback?</h1>
                    <div className="flex flex-col items-center gap-y-2">
                        <h2 className="text-xl">Email: <a className="underline text-blue-500" href="mailto:gradehubfisd@gmail.com">gradehubfisd@gmail.com</a></h2>
                        <h2 className="text-xl">Instagram: <a className="underline text-blue-500" href="https://instagram.com/gradehubfisd?igshid=NzZlODBkYWE4Ng%3D%3D&utm_source=qr">@gradehubfisd</a></h2>
                        <h2 className="text-xl">Github: <a className="underline text-blue-500" href="https://github.com/drPod/GradeHub-ClassDB">GradeHub GPA Database</a></h2>
                    </div>
                </div>
            </div>
        </Container>
    )
}