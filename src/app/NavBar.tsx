"use client";

// Import necessary libraries and components
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Navbar, Nav, Container, Image } from 'react-bootstrap';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function NavBar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <Navbar sticky="top" expand="sm" collapseOnSelect style={{ backgroundSize: "0", backgroundColor: "#03293F" }}>
      <Container>
        <Navbar.Brand as={Link} href="/" passHref style={{ color: "white" }}>
          Super Bowl Prop Tracker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" style={{ backgroundColor: 'white' }} />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"> {/* Use me-auto to push the next nav items to the right */}
            <Nav.Link as={Link} href="/profile" style={{ color: pathname === '/profile' ? "#0d6efd" : "white" }}>
              Profile
            </Nav.Link>
            <Nav.Link as={Link} href="/create-group" style={{ color: pathname === '/create-group' ? "#0d6efd" : "white", marginLeft: '10px' }}>
              Create Group
            </Nav.Link>
            <Nav.Link as={Link} href="/global-leaderboard" style={{ color: pathname === '/global-leaderboard' ? "#0d6efd" : "white", marginLeft: '10px' }}>
              Global Leaderboard
            </Nav.Link>
          </Nav>
          <Nav>
          {session ? (
            <Nav className="align-items-center">
              {session.user.icon && (
                <Image 
                  src={session.user.icon} 
                  roundedCircle 
                  style={{ width: '30px', height: '30px', marginRight: '10px' }}
                />
              )}
              <Nav.Item style={{ color: "white", marginRight: '10px' }}>
                Hello {session.user.name}
              </Nav.Item>
              <Nav.Link style={{ color: "white" }} onClick={() => signOut({ callbackUrl: '/', redirect: true })}>
                Logout
              </Nav.Link>
            </Nav>
          ) : (
              <>
                <Nav.Link href="/api/auth/signin/credentials" style={{ color: "white" }} >
                  Login
                </Nav.Link>
                <Nav.Link as={Link} href="/signup" style={{ color: pathname === '/signup' ? "#0d6efd" : "white" }} >
                  Signup
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}


