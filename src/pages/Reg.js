import React, {Component} from 'react';
import {Form, Alert, Button} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';

const {ApiUrl} = require('../config');
const {setCookie, getCookie} = require('../modules/API');

export default class Reg extends Component {
    constructor(props) {
        super(props);
        this.state = {login: false, password: false, message: false};

        this.onChangeLogin = this.onChangeLogin.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
    }

    actionReg = async (event) => {
        event.preventDefault();
        if (this.state.login && this.state.password) {
            await fetch(ApiUrl.reg, {
                method: 'POST',
                body: JSON.stringify({action: 'reg', login: this.state.login, password: this.state.password})
            }).then((res) => {
                if (res.status >= 200 && res.status < 300) {
                    return res;
                } else {
                    let error = new Error(res.statusText);
                    error.response = res;
                    throw error
                }
            }).then(res => res.json())
                .then(data => {
                    if (data.status === 'successfully') {
                        setCookie('account', JSON.stringify({'id': data.list.id, 'token': data.list.token}), {'max-age': 3600, 'path': '/'});
                        this.props.transfer.changeProps({user: true});
                    } else if (data.status === 'error') {
                        this.setState({message: ['danger', data.message]});
                    }
                })
                .catch((e) => {
                    console.log('Error: ' + e.message);
                });
        }
    }

    onMessage = () => {
        setTimeout(() => {
            this.setState({message: false});
        }, 1500);
        return <Alert variant={this.state.message[0]}>
            {this.state.message[1]}
        </Alert>;
    }

    onChangeLogin = (event) => {
        this.setState({login: event.target.value});
    }

    onChangePassword = (event) => {
        this.setState({password: event.target.value});
    }

    render() {
        return (
            <div>
                {!!!getCookie('account').token ? (
                    <Form onSubmit={this.actionReg} className="form-auth">
                        {this.state.message && this.onMessage()}
                        <h1 className="h3 mb-3 font-weight-normal">Регистрация</h1>
                        <Form.Control onChange={this.onChangeLogin} type="text" placeholder="Введите логин" required/>
                        <Form.Control onChange={this.onChangePassword} type="password" className="mb-3" placeholder="Введите пароль" required/>
                        <Button variant="primary" size="lg" type="submit" disabled={!(this.state.login && this.state.password && !this.state.message)} block>Создать</Button>
                    </Form>
                ) : (<Redirect to="/"/>)}
            </div>
        );
    }
}