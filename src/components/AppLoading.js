import React, {Component} from 'react';

export default class AppLoading extends Component {
    render() {
        return (
            <div>
                <svg className="spinner" viewBox="0 0 50 50">
                    <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"/>
                </svg>
            </div>
        );
    }
}