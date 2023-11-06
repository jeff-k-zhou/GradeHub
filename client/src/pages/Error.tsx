import Container from "../components/Container"
import Nav from "../components/Nav"

export default function Error() {
    return (
        <Container>
            <Nav active={-1}></Nav>
            <div className="w-full h-full flex items-center justify-center">
                <h1 className="text-4xl">We couldn't find the page you're looking for</h1>
            </div>
        </Container>
    )
}