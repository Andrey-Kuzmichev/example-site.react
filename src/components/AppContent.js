import React, {Component} from 'react';
import {Container} from 'react-bootstrap';
import {Switch, Route} from 'react-router-dom';

import Main from '../pages/Main';
import Goods from '../pages/Goods';
import Reg from '../pages/Reg';
import Auth from '../pages/Auth';
import Profile from '../pages/Profile';

export default class AppContent extends Component {
    render() {
        return (
            <Container className="p-4">
                <Switch>
                    <Route exact path="/" component={Main}/>
                    <Route exact path={['/goods', '/goods/:id', '/goods/:id/:action']}>
                        <Goods transfer={{changeProps: this.props.transfer.changeProps, loading: this.props.transfer.loading}}/>
                    </Route>
                    <Route path="/reg">
                        <Reg transfer={{changeProps: this.props.transfer.changeProps}}/>
                    </Route>
                    <Route path="/auth">
                        <Auth transfer={{changeProps: this.props.transfer.changeProps}}/>
                    </Route>
                    <Route exact path={['/profile', '/profile/:id', '/profile/:id/:action']}>
                        <Profile transfer={{
                            changeProps: this.props.transfer.changeProps,
                            user: this.props.transfer.user,
                            loading: this.props.transfer.loading
                        }}/>
                    </Route>
                </Switch>
            </Container>
        );
    }
}