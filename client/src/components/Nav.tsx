import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from "@nextui-org/react";

interface Props {
    logged: boolean
}

export default function Nav(props: Props) {
    return (
        <Navbar>
            <NavbarBrand>
                {
                    // TODO: Add logo
                }
            </NavbarBrand>
            <NavbarContent justify="end">
                <NavbarItem>
                    <Button href={ props.logged ? "/dashboard": "/login" }>
                        { props.logged ? "Dashboard" : "Login" }
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    )
}