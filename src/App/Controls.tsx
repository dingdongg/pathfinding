import React, { Component } from 'react';
import Board from "./Board";
import Node, { NodeType, BarrierNode } from "./Node";

interface IControlsProps {
}

interface IControlsState {
    barrierType: BarrierNode
}

export default class Controls extends Component<IControlsProps, IControlsState> {
    constructor(props: any) {
        super(props);
        this.state = {
            barrierType: NodeType.WallNode
        }
    }
    
    componentDidMount() {
        // Do this to fix error where can't use node types
        Node.createNode(1,1);
    }

    changeBarrier(barrier:BarrierNode) {
        this.setState({...this.state, barrierType: barrier});
    }

    render() {
        return (<div>
        <div className="controls">
            <h1>Pathfinder</h1>
            <div className="placements">
                <button onClick={() => this.changeBarrier(NodeType.WallNode)}>Wall</button>
                <button onClick={() => this.changeBarrier(NodeType.ForestNode)}>Forest</button>
            </div>
        </div>
            <Board barrierType={this.state.barrierType}/>
        </div>);
    }
}