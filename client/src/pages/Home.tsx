import Container from "../components/Container"
import Nav from "../components/Nav"
import "../components/animations/fadeIn.css"
import { Chip, Divider, Card, CardBody } from "@nextui-org/react"
import version from "../components/constants/version"
import { useState, useEffect } from "react"
import Loading from "../components/Loading"
import Changelog from "../components/constants/changelog.md"
import Markdown from "react-markdown"
import { useDisclosure } from "@nextui-org/react"
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react"
import cards from "../components/constants/cards"
import HomeCard from "../components/HomeCards"

export default function Home() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const [loading, setLoading] = useState<boolean>(true)
    const [changelog, setChangelog] = useState<string>("")

    useEffect(() => {
        fetch(Changelog).then((res) => res.text()).then((text) => {
            setChangelog(text)
            setLoading(false)
        })
    }, [])
    if (loading) {
        return <Container><Loading /></Container>
    } else {
        return (
            <Container>
                <div className="flex flex-col items-center w-full min-h-full select-none">
                    <Nav active={-1} />
                    <div className="flex flex-col items-start w-full p-10">
                        <span className="flex flex-col md:flex-row gap-y-5 md:gap-y-0 md:gap-x-5 justify-center md:items-center">
                            <p className="text-5xl">GradeHub</p>
                            <Chip color="primary" size="md" className="cursor-pointer select-none" onClick={onOpen}>{version}</Chip>
                        </span>
                        <div className="flex flex-row justify-center md:justify-start flex-wrap w-full mt-10">
                            {
                                cards.map((card, index) => (
                                    <HomeCard key={index} title={card.title} icon={card.icon} link={card.link} />
                                ))
                            }
                        </div>
                    </div>
                </div>
                <Modal size="4xl" isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
                    <ModalContent className="w-full">
                        <ModalHeader>Changelog</ModalHeader>
                        <Divider />
                        <ModalBody className="p-10 w-full">
                            <Markdown className="prose">{changelog}</Markdown>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Container>
        )
    }
}