import React, {Component} from 'react';
import './App.css';

import AppHeader from './components/AppHeader';
import AppContent from './components/AppContent';
import AppFooter from './components/AppFooter';

const {getCookie} = require('./modules/API');

export default class App extends Component {
    state = {user: false, loading: true};

    componentDidMount() {
        if (!!getCookie('account').token) {
            this.setState({user: true});
        }
    }

    changeProps = (state) => {
        this.setState(state);
    }

    render() {
        return (
            <div>
                <AppHeader transfer={{user: this.state.user}}/>
                <AppContent transfer={{
                    changeProps: this.changeProps,
                    user: this.state.user,
                    loading: this.state.loading
                }}/>
                <AppFooter/>
            </div>
        );
    }
}