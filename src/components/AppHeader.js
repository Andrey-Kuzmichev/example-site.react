import React, {Component} from 'react';
import {Navbar, Container, Nav} from 'react-bootstrap';
import {NavLink} from 'react-router-dom';

const {getCookie} = require('../modules/API');

export default class AppHeader extends Component {
    render() {
        return (
            <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand>Site</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                    <Navbar.Collapse id="responsive-navbar-nav">
                        {!!!getCookie('account').token || !this.props.transfer.user ? (
                            <Nav className="mr-auto">
                                <NavLink exact to="/" className="nav-link" role="button">Главная</NavLink>
                                <NavLink to="/goods" className="nav-link" role="button" activeClassName="text-warning">Каталог товаров</NavLink>
                            </Nav>
                        ) : (
                            <Nav className="mr-auto">
                                <NavLink exact to="/" className="nav-link" role="button">Главная</NavLink>
                                <NavLink to="/goods" className="nav-link" role="button" activeClassName="text-warning">Каталог товаров</NavLink>
                                <NavLink exact to={`/profile/${getCookie('account').id}/orders`}
                                         className="nav-link" role="button" activeClassName="text-primary">Заказы</NavLink>
                            </Nav>
                        )}
                        {!!!getCookie('account').token || !this.props.transfer.user ? (
                            <Nav>
                                <NavLink to="/reg" className="nav-link" role="button" activeClassName="text-primary">Создать</NavLink>
                                <NavLink to="/auth" className="nav-link" role="button" activeClassName="text-success">Войти</NavLink>
                            </Nav>
                        ) : (
                            <Nav>
                                <NavLink exact to={`/profile/${getCookie('account').id}`}
                                         className="nav-link" role="button" activeClassName="text-success">Профиль</NavLink>
                                <NavLink exact to={`/profile/${getCookie('account').id}/exit`}
                                         className="nav-link" role="button" activeClassName="text-danger">Выйти</NavLink>
                            </Nav>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }
}