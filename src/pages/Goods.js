import React, {Component} from 'react';
import {CardColumns, Card, Button, Alert, Form, InputGroup, FormControl} from 'react-bootstrap';
import {withRouter, Link, Redirect} from 'react-router-dom';
import AppLoading from '../components/AppLoading';

const {ApiUrl} = require('../config');
const {getCookie} = require('../modules/API');

class Goods extends Component {
    constructor(props) {
        super(props);
        this.state = {products: [], user: false, order: false, message: false, email: false, tel: false};
        this._isMounted = false;
    }

    async componentDidMount() {
        this._isMounted = true;

        await fetch(ApiUrl.goods).then((res) => {
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
                    this.setState({products: data});
                    this.props.transfer.changeProps({loading: false});
                } else if (data['status'] === 'error') {
                    this.props.transfer.changeProps({loading: true});
                }
            })
            .catch((e) => {
                console.log('Error: ' + e.message);
            });

        if (!!getCookie('account').token) {
            this.setState({user: getCookie('account').id});
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    cardProducts = () => {
        return <CardColumns>
            {this.state.products.map((product, i) => (
                <Card style={{maxWidth: '20rem'}} key={i}>
                    <Card.Body>
                        <Card.Title>{product.title} {checkNow(product.now)}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{product['subtitle']}</Card.Subtitle>
                        <Card.Text>Цена: {product['price']}</Card.Text>
                    </Card.Body>
                    <Card.Footer>
                        <Link to={`/goods/${product.id}`} type="button" className="btn btn-outline-primary btn-sm mr-3">Подробнее</Link>
                        <Link to={`/goods/${product.id}/order`} type="button" className="btn btn-outline-success btn-sm">Заказать</Link>
                    </Card.Footer>
                </Card>
            ))}
        </CardColumns>;
    }

    cardProduct = (id) => {
        return <div>
            <Card style={{maxWidth: '20rem'}} className="mb-4">
                <Card.Body>
                    <Card.Title>{this.state.products[id].title} {checkNow(this.state.products[id].now)}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{this.state.products[id]['subtitle']}</Card.Subtitle>
                    <Card.Text>{this.state.products[id].description}</Card.Text>
                </Card.Body>
                <Card.Footer>
                    <Link to={`/goods/${this.state.products[id].id}/order`} type="button" className="btn btn-outline-success btn-sm">Заказать</Link>
                </Card.Footer>
            </Card>
            <Card>
                <Link to="/goods" type="button" className="btn btn-outline-danger btn-sm">Назад</Link>
            </Card>
        </div>;
    }

    onMessage = () => {
        setTimeout(() => {
            this.setState({message: false});
        }, 1500);
        return <Alert variant={this.state.message[0]}>
            {this.state.message[1]}
        </Alert>;
    }

    actionOrder = async (event) => {
        event.preventDefault();

        const formData = {
            user: (getCookie('account').token ?? this.state.user),
            idGoods: this.props.match.params.id,
            name: event.target.elements.name.value,
            email: event.target.elements.email.value,
            telephone: event.target.elements.telephone.value,
        };

        if (formData.name && this.state.email && this.state.tel) {
            await fetch(ApiUrl.url, {
                method: 'POST',
                body: JSON.stringify({action: 'order', order: formData})
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
                        if (!this.state.user) {
                            this.setState({message: ['success', data.message]});
                        } else {
                            this.setState({user: getCookie('account').id, order: true});
                        }
                    } else if (data.status === 'error') {
                        this.setState({message: ['danger', data.message]});
                    }
                })
                .catch((e) => {
                    console.log('Error: ' + e.message);
                });
        }
    }

    formatEmail = () => {
        const element = document.getElementById('email');
        const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
        const address = element.value;
        if (address === null) {
            this.setState({email: false});
            return;
        }
        if (reg.test(address)) {
            this.setState({email: true});
        } else {
            this.setState({email: false});
        }
    }

    formatNumber = () => {
        const element = document.getElementById('tel');
        let pattern = '7 123 456-78-90', arr = element.value.match(/\d/g), i = 0;
        if (arr === null) {
            this.setState({tel: false});
        } else if (arr.length < 11) {
            this.setState({tel: false});
        } else {
            this.setState({tel: true});
            element.value = pattern.replace(/\d/g, function (a, b) {
                if (arr.length) i = b + 1;
                return arr.shift();
            }).substring(0, i);
        }
    }

    orderGoods = () => {
        const paramsID = this.props.match.params.id;
        const productsID = this.state.products[paramsID];

        return <Form onSubmit={this.actionOrder} className="form-order">
            {this.state.message && this.onMessage()}
            <h1 className="h3 mb-3 font-weight-normal">Форма заказа</h1>
            <Form.Control type="text" name="name" className="first" placeholder="Введите Ф.И.О" required/>
            <Form.Control onChange={this.formatEmail} id="email" type="email" name="email" className="inside" placeholder="Введите e-mail" required/>
            <InputGroup className="mb-1">
                <InputGroup.Prepend>
                    <InputGroup.Text className="inside">+</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl onChange={this.formatNumber} id="tel" type="tel" pattern="(\+?\d[- .]*){11}"
                             name="telephone" className="inside" placeholder="Введите телефон" required/>
            </InputGroup>
            <InputGroup.Text className="form-control mb-1 inside">{productsID.title}</InputGroup.Text>
            <InputGroup.Text className="form-control mb-3 last">Цена: {productsID['price']}</InputGroup.Text>
            <Button variant="success" size="lg" type="submit" className="mb-3"
                    disabled={!(!this.state.message && this.state.email && this.state.tel)} block>Заказать</Button>
            <Card>
                <Link to="/goods" type="button" className="btn btn-outline-danger btn-sm">Назад</Link>
            </Card>
        </Form>;
    }

    outputGoods = () => {
        const paramsID = this.props.match.params.id;
        const productsID = this.state.products[paramsID];
        if (this._isMounted) {
            if (!!!paramsID) {
                return this.cardProducts();
            } else if (!!productsID) {
                if (!!!this.props.match.params.action) {
                    return this.cardProduct(paramsID);
                } else {
                    if (this.props.match.params.action === 'order') {
                        if (this.state.order) {
                            return <Redirect to={`/profile/${this.state.user}/orders`}/>;
                        }
                        return this.orderGoods();
                    }
                }
            } else {
                return <Redirect to="/goods"/>;
            }
        }
    }

    render() {
        return (
            <div>
                {this.props.transfer.loading ? (<AppLoading/>) : (this.outputGoods())}
            </div>
        );
    }
}

export default withRouter(Goods);

const checkNow = (now) => {
    if (now) {
        return <span className="badge badge-danger">Новинка</span>;
    } else {
        return null;
    }
}