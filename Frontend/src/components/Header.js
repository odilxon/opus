import React from 'react';
import { Container, ListGroup, Nav, Navbar, Row } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <Navbar bg="white" expand="lg">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          Nimadir
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={NavLink} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/">
              Link
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/">
              <div className="account">
                <img src="https://picsum.photos/200" alt="random" />

                <ListGroup className="account_list list-unstyled p-3">
                  <li className="list-group-item">
                    <div className="row">
                      <div className="col-md-3 col-4">
                        <img src="https://picsum.photos/200" alt="random" />
                      </div>
                      <div className="col-md-9 col-8">
                        <p className="h6">Lorem, ipsum.</p>
                        <p className="text-muted">asadbek@gmail.com</p>
                      </div>
                    </div>
                  </li>
                  <li>{/* <Link></Link> */}</li>
                </ListGroup>
              </div>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
