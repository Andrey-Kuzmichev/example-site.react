import React, {Component} from 'react';
import {Navbar, Container} from 'react-bootstrap';

export default class AppFooter extends Component {
    render() {
        return (
            <Navbar collapseOnSelect expand="md" bg="dark" variant="dark" fixed="bottom">
                <Container>
                </Container>
            </Navbar>
        );
    }
}