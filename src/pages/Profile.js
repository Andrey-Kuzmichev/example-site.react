import React, {Component} from 'react';
import {Card, Button, Table, Form, Alert} from 'react-bootstrap';
import {withRouter, Redirect} from 'react-router-dom';
import AppLoading from '../components/AppLoading';

const {ApiUrl} = require('../config');
const {getCookie, deleteCookie} = require('../modules/API');

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {user: [], orders: false, orderChange: false, orderChanges: false, status: false};
        this._isMounted = false;
        this.orderCancel = this.orderCancel.bind(this);
        this.orderChange = this.orderChange.bind(this);
    }

    async componentDidMount() {
        this._isMounted = true;

        if (!!getCookie('account').token) {
            await fetch(ApiUrl.profile, {
                method: 'POST',
                body: JSON.stringify({action: 'profile', token: getCookie('account').token})
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
                    if (!!!data['status']) {
                        this.setState({user: data});
                        this.props.transfer.changeProps({loading: false});
                    } else if (data['status'] === 'error') {
                        this.props.transfer.changeProps({loading: true});
                    }
                })
                .catch((e) => {
                    console.log('Error: ' + e.message);
                });

            if (Number(this.props.match.params.id) === Number(getCookie('account').id)) {
                await this.ordersUpdate();
            }
        }
    }

    ordersUpdate = async () => {
        await fetch(ApiUrl.profile, {
            method: 'POST',
            body: JSON.stringify({action: 'ordersProfile', token: getCookie('account').token})
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
                if (!!!data['status']) {
                    this.setState({orders: data});
                    this.props.transfer.changeProps({loading: false});
                } else if (data['status'] === 'error') {
                    this.props.transfer.changeProps({loading: true});
                }
            })
            .catch((e) => {
                console.log('Error: ' + e.message);
            });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    listProfile = () => {
        return <div>
            <Card style={{maxWidth: '20rem'}} className="mb-4">
                <Card.Body>
                    <Card.Title>{this.state.user.name}</Card.Title>
                </Card.Body>
            </Card>
        </div>;
    }

    orderChangeStatus = (event) => {
        this.setState({orderChanges: true})
        this.setState({status: {old: event.target.dataset.status, new: event.target.value}})
    }

    orderChange = async (event) => {
        if (this.state.user.access !== 'user') {
            if (this.state.orderChange[event.target.dataset.cid]) {
                if (this.state.status && this.state.status.old !== this.state.status.new && event.target.dataset.status === this.state.status.old) {
                    await fetch(ApiUrl.profile, {
                        method: 'POST',
                        body: JSON.stringify({
                            action: 'orderChanges',
                            product: event.target.dataset.id,
                            orderChanges: {status: this.state.status.new},
                            token: getCookie('account').token
                        })
                    }).then((res) => {
                        if (res.status >= 200 && res.status < 300) {
                            return res;
                        } else {
                            let error = new Error(res.statusText);
                            error.response = res;
                            throw error
                        }
                    }).then(res => res.json())
                        .then(async data => {
                            if (String(data.status) === 'successfully') {
                                this.setState({orderChange: false, orderChanges: false})
                                await this.ordersUpdate();
                            }
                        })
                        .catch((e) => {
                            console.log('Error: ' + e.message);
                        });
                } else {
                    this.setState({orderChange: false})
                }
            } else {
                let cid = {};
                cid[event.target.dataset.cid] = true;
                this.setState({status: false})
                this.setState({orderChange: cid})
            }
        }
    }

    orderCancel = async (event) => {
        await fetch(ApiUrl.profile, {
            method: 'POST',
            body: JSON.stringify({action: 'orderCancel', token: getCookie('account').token, product: event.target.dataset.id})
        }).then((res) => {
            if (res.status >= 200 && res.status < 300) {
                return res;
            } else {
                let error = new Error(res.statusText);
                error.response = res;
                throw error
            }
        }).then(res => res.json())
            .then(async data => {
                if (String(data.status) === 'successfully') {
                    await this.ordersUpdate();
                }
            })
            .catch((e) => {
                console.log('Error: ' + e.message);
            });
    }

    ordersProfile = () => {
        return <div>
            {this.state.orders[0] ? (
                <Table responsive striped bordered hover variant="dark" className="text-center">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Товар</th>
                        <th>Цена</th>
                        <th>Имя</th>
                        <th>E-Mail</th>
                        <th>Телефон</th>
                        <th>Статус</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.orders.map((order, i) => (
                        <tr key={i++}>
                            <td>{i}</td>
                            <td>{order['nameGoods']}</td>
                            <th>{order['price']}</th>
                            <td>{order.name}</td>
                            <td>{order.email}</td>
                            <td>{order.telephone}</td>
                            {this.state.user.access === 'user' ? (<td>{order.status}</td>)
                                : (<td>{!this.state.orderChange[i] ? (<div>{order.status}</div>)
                                    : (<Form.Control data-status={order.status} onChange={this.orderChangeStatus} defaultValue={order.status} size="sm" as="select">
                                        <option value="Ожидайте">Ожидайте</option>
                                        <option value="Выполняется">Выполняется</option>
                                        <option value="Готов">Готов</option>
                                    </Form.Control>)}</td>)}
                            {this.state.user.access === 'user' ? (
                                <td>
                                    {(order.status === 'Выполняется' || order.status === 'Готов') ? null : (
                                        <Button variant="danger" data-id={order.id} onClick={this.orderCancel} size="sm" className="ml-3">Отменить</Button>
                                    )}
                                </td>
                            ) : (
                                <td>
                                    {!this.state.orderChange[i] ? (<div>
                                        <Button variant="info" data-id={order.id} data-cid={i} data-status={order.status} onClick={this.orderChange} size="sm"
                                                className="ml-3">Изменить</Button>
                                        <Button variant="danger" data-id={order.id} onClick={this.orderCancel} size="sm" className="ml-3">Удалить</Button>
                                    </div>) : (<div>
                                        {!this.state.orderChanges || this.state.status.old === this.state.status.new ? (
                                                <Button variant="danger" data-id={order.id} data-cid={i} onClick={this.orderChange} size="sm" className="ml-3">Назад</Button>
                                            )
                                            : (<Button variant="success" data-id={order.id} data-cid={i} data-status={order.status} onClick={this.orderChange} size="sm"
                                                       className="ml-3">Сохранить</Button>)}
                                    </div>)}
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </Table>) : (<Alert variant="danger">
                {this.state.user.access === 'user' ? ('Ваш список заказов пуст') : ('Список заказов пуст')}
            </Alert>)}
        </div>;
    }

    exitProfile() {
        return <Card>
            <Button variant="danger" onClick={this.exit}>Выйти?</Button>
        </Card>;
    }

    exit = () => {
        this.props.transfer.changeProps({user: false});
        deleteCookie('account');
    }

    outputProfile = () => {
        if (!this.props.transfer.loading) {
            const paramsID = this.props.match.params.id;
            const usersID = getCookie('account').id;
            if (this._isMounted) {
                if (!!paramsID && Number(paramsID) === Number(usersID)) {
                    if (!this.state.user['blocking']) {
                        if (!!!this.props.match.params.action) {
                            return this.listProfile();
                        } else {
                            if (this.props.match.params.action === 'orders') {
                                return this.ordersProfile();
                            } else if (this.props.match.params.action === 'exit') {
                                return this.exitProfile();
                            }
                        }
                    } else {
                        this.exit();
                    }
                } else {
                    return <Redirect to="/"/>;
                }
            }
        } else {
            return <AppLoading/>;
        }
    }

    render() {
        return (
            <div>
                {!!getCookie('account').token ? (this.outputProfile()) : (<Redirect to="/"/>)}
            </div>
        );
    }
}

export default withRouter(Profile);