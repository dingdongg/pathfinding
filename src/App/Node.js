import React, { Component } from 'react';
import { StartNode, EndNode, WallNode } from './Board';

export default class Node extends Component {
    renderWallSegments() {
        const segments = new Array(9);
        for (let i = 0; i < segments.length; i++) {
            const className = this.props.wallSegments[i] ? "wall-segment" : "";
            segments[i] = <div key={i} className={className}></div>
        }
        return <div className="wall-segments">{segments}</div>
    }

    render() {
        let extraClasses = "";
        switch (this.props.nodeType) {
            case StartNode:
                extraClasses = "start-node";
                break;
            case EndNode:
                extraClasses = "end-node";
                break;
            case WallNode:
                extraClasses = "wall-node";
                break;
            default:
        }
        const row = this.props.row, col = this.props.col;

        return (
            <div className={`node ${extraClasses}`}
                onMouseDown={() => this.props.onMouseDown(row, col)}
                onMouseEnter={() => this.props.onMouseEnter(row, col)}
                onMouseUp={() => this.props.onMouseUp()}>
                {this.renderWallSegments()}</div>
        )
    }
}