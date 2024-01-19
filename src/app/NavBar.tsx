"use client";

// Import necessary libraries and components
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function NavBar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <Navbar  sticky="top" expand="sm" collapseOnSelect
    style={{backgroundSize: "0", backgroundColor: "#03293F"}}>
      <Container >
        <Navbar.Brand as={Link} href="/" style={{color: "white"}}>
          Super Bowl Prop Tracker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" style={{ backgroundColor: 'white' }}/>
        <Navbar.Collapse id="main-navbar" >
          <Nav className="mr-auto">
            <Nav.Link as={Link} href="/profile" active={pathname === '/profile'} style={{color: "white"}}>
              Profile
            </Nav.Link>
            <Nav.Link as={Link} href="/create-group" active={pathname === '/create-group'} style={{color: "white"}}>
              Create New Group
            </Nav.Link>
          </Nav>

          <Nav className="ml-auto">
            <Nav>
              {session ? (
                // If user is logged in, display the logout link
                <Nav.Link style={{color: "white"}} onClick={() => signOut({ callbackUrl: '/', redirect:true })}>Logout</Nav.Link>
              ) : (
                <>
            
                <Nav.Link href="/api/auth/signin/credentials" active={pathname === '/login'} style={{color: "white"}}>
                  Login
                </Nav.Link>
                <Nav.Link as={Link} href="/signup" active={pathname === '/signup'} style={{color: "white"}}>
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


