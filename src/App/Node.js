import React, { Component } from 'react';

export default class Node extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const extraClasses = this.props.startNode ? "start-node" : 
        this.props.endNode ? "end-node" :
        this.props.wallNode ? "wall-node" : "";

        return (
            <div className={`node ${extraClasses}`}>{this.props.index}</div>
        )
    }
}