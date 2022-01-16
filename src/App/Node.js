import React, { Component } from 'react';

export default class Node extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const extraClasses = this.props.startNode ? "start-node" :
            this.props.endNode ? "end-node" :
                this.props.wallNode ? "wall-node" : "";
        const row = this.props.row, col = this.props.col;

        return (
            <div className={`node ${extraClasses}`}
                onMouseDown={() => this.props.onMouseDown(row, col)}
                onMouseEnter={() => this.props.onMouseEnter(row, col)}
                onMouseUp={() => this.props.onMouseUp()}>
                {this.props.index}</div>
        )
    }
}