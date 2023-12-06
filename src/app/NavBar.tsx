"use client";

// Import necessary libraries and components
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <Navbar bg="primary" variant="dark" sticky="top" expand="sm" collapseOnSelect>
      <Container>
        <Navbar.Brand as={Link} href="/">
          Prop Sheet Generator
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="mr-auto">
            <Nav.Link as={Link} href="/profile" active={pathname === '/profile'}>
              Profile
            </Nav.Link>
            <Nav.Link as={Link} href="/create-group" active={pathname === '/create-group'}>
              Create New Group
            </Nav.Link>
            <Nav.Link as={Link} href="/submit" active={pathname === '/submit'}>
              Enter Submission
            </Nav.Link>
          </Nav>

          <Nav className="ml-auto">
            <Nav>
              {session ? (
                // If user is logged in, display the logout link
                <Nav.Link href="/api/auth/signout">Logout</Nav.Link>
              ) : (
                <>
            
                <Nav.Link href="/api/auth/signin/credentials" active={pathname === '/login'}>
                  Login
                </Nav.Link>
                <Nav.Link as={Link} href="/signup" active={pathname === '/signup'}>
                Signup
                </Nav.Link>
                </>
              )}
            </Nav>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}


