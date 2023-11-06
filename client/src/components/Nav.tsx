import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure, Link as Lnk, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@nextui-org/react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import links from "./constants/links"

interface Props {
    active: number
}

export default function Nav(props: Props) {
    const { onOpen, isOpen, onOpenChange } = useDisclosure()
    const [logged, setLogged] = useState(false)

    useEffect(() => {
        if (window.localStorage.getItem("username") && window.localStorage.getItem("password")) {
            setLogged(true)
        }
    }, [])

    function Logout() {
        localStorage.clear()
        sessionStorage.clear()
        window.location.replace("/login")
    }
    return (
        <Navbar isBordered>
            <NavbarMenuToggle 
                className="md:hidden"
            />
            <NavbarBrand className="select-none">
                <Link to="/">
                    <span className="flex h-full items-center gap-x-3">
                        <img src="/icon.png" width={60}></img>
                        Alpha
                    </span>
                </Link>
            </NavbarBrand>
            <NavbarContent className="hidden md:flex" justify="center">
                {
                    links.map((item, index) => (
                        <NavbarItem key={index} isActive={index === props.active}>
                            <Lnk color={index === props.active ? "primary" : "foreground"}>
                                <Link to={item.link}>
                                    {item.name}
                                </Link>
                            </Lnk>
                        </NavbarItem>
                    ))
                }
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    {
                        logged ?
                            <>
                                <Button color="primary" onClick={onOpen}>
                                    Logout
                                </Button>
                                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                                    <ModalContent>
                                        {(onClose) => (
                                            <>
                                                <ModalHeader>Logout</ModalHeader>
                                                <ModalBody>
                                                    Are you sure you want to logout?
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button color="danger" onClick={Logout}>Logout</Button>
                                                    <Button onClick={onClose}>Cancel</Button>
                                                </ModalFooter>
                                            </>
                                        )}
                                    </ModalContent>
                                </Modal>
                            </>
                            :
                            <Link to="/login">
                                <Button color="primary">
                                    Login
                                </Button>
                            </Link>
                    }
                </NavbarItem>
            </NavbarContent>
            <NavbarMenu>
                {
                    links.map((item, index) => (
                        <NavbarMenuItem key={index}>
                            <Lnk color={index === props.active ? "primary" : "foreground"}>
                                <Link to={item.link}>
                                    {item.name}
                                </Link>
                            </Lnk>
                        </NavbarMenuItem>
                    ))
                }
            </NavbarMenu>
        </Navbar>
    )
}