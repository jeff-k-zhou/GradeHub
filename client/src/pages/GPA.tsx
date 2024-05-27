import Quarter from "../components/gpa/Quarter"
import Container from "../components/Container"
import Nav from "../components/Nav"
import { Tabs, Tab } from "@nextui-org/react"
import Cumulative from "../components/gpa/Cumulative"

export default function GPA() {
    return (
        <Container>
            <Nav active={1} />
            <div className="mt-5 text-center">
                <Tabs color="primary" variant="bordered">
                    <Tab title="Quarter">
                        <Quarter />
                    </Tab>
                    <Tab title="Cumulative">
                        <Cumulative />
                    </Tab>
                </Tabs>
            </div>
        </Container>
    )
}