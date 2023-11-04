"use client";

import Link from "next/link";
import {Navbar, Nav, Container } from "react-bootstrap"
import { usePathname } from "next/navigation";

export default function NavBar() {
    const pathname = usePathname();


    return (
        <Navbar bg="primary" variant="dark" sticky="top" expand="sm" collapseOnSelect>
            <Container>
                <Navbar.Brand as={Link} href="/">
                        Prop Sheet Generator
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav>
                        <Nav.Link as={Link} href="/profile" active={pathname === "/profile"}>Profile</Nav.Link>
                        <Nav.Link as={Link} href="/api/auth/signin/credentials" active={pathname === "/login"}>Login</Nav.Link>
                        <Nav.Link as={Link} href="/signup" active={pathname === "/signup"}>Signup</Nav.Link>
                        <Nav.Link as={Link} href="/create-group" active={pathname === "/create-group"}>Create New Group</Nav.Link>
                        <Nav.Link as={Link} href="/submit" active={pathname === "/submit"}>Enter Submission</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

