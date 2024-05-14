// Navbar.tsx

import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";

const NavBar: React.FC = () => {
  const navLinkMargin = "45px";
  const [expanded, setExpanded] = useState(false);

  const handleNavItemClick = () => {
    setExpanded(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Navbar
      bg="light"
      variant="light"
      expand="lg"
      className="mb-3 fixed-top" // Added fixed-top class
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.9)", // Light background color
      }}
      expanded={expanded}
    >
      <Container>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(!expanded)}
        />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav style={{ fontSize: "18px" }} onSelect={handleNavItemClick}>
            <Nav.Link href="#Home" style={{ marginRight: navLinkMargin }}>
              Upload
            </Nav.Link>
            <Nav.Link href="#Comment" style={{ marginRight: navLinkMargin }}>
              Comment
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;