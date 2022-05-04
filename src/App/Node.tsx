import React, { Component } from 'react';


// These enums used for node type
export enum NodeType {
    EmptyNode, StartNode, EndNode, WallNode, ForestNode,
}

export type BarrierNode = NodeType.WallNode | NodeType.ForestNode;

export interface INodeProps {
    onMouseDown: any,
    onMouseUp: any,
    onMouseEnter: any,
    row: number,
    col: number,
    nodeType: NodeType,
    barrierSegments: boolean[],
    // Pathfinding props
    distance: number,
    weight: number,
    prev: any, // Used for keeping track of shortest path
    visited: boolean,
    isPath: boolean, // True if this node is part of the shortest path
}

interface INodeState {
}

// Class for one "Node" (square) on the board
export class Node extends Component<INodeProps, INodeState> {
    static createNode(row: number, col: number): INodeProps {
        return {
            onMouseDown: null,
            onMouseUp: null,
            onMouseEnter: null,
            row: row,
            col: col,
            nodeType: NodeType.EmptyNode,
            barrierSegments: new Array(9).fill(false),
            // Pathfinding props
            distance: Infinity,
            weight: 1,
            prev: null, // Used for keeping track of shortest path
            visited: false,
            isPath: false, // True if this node is part of the shortest path
        }
    }

    renderBarrierSegments() {
        const segments = new Array(9);
        for (let i = 0; i < segments.length; i++) {
            const className = this.props.barrierSegments[i] ? "barrier-segment" : "";
            segments[i] = <div key={i} className={className}></div>
        }
        return <div className="barrier-segments">{segments}</div>
    }

    render() {
        let extraClasses = "";
        switch (this.props.nodeType) {
            case NodeType.StartNode:
                extraClasses = "start-node";
                break;
            case NodeType.EndNode:
                extraClasses = "end-node";
                break;
            case NodeType.WallNode:
                extraClasses = "wall-node";
                break;
            case NodeType.ForestNode:
                extraClasses = "forest-node";
                break;
            default:
        }
        extraClasses += this.props.visited ? " visited" : "";
        extraClasses += this.props.isPath ? " path-node" : "";
        const row = this.props.row, col = this.props.col;

        return (
            <div className={`node ${extraClasses}`}
                onMouseDown={() => this.props.onMouseDown(row, col)}
                onMouseEnter={() => this.props.onMouseEnter(row, col)}
                onMouseUp={() => this.props.onMouseUp()}>
                {this.renderBarrierSegments()}</div>
        )
    }
}