import React, { Component } from 'react';
import Board from "./Board";
import Node, { NodeType, BarrierNode } from "./Node";

interface IControlsProps {
}

interface IControlsState {
    barrierType: BarrierNode,
    boardHeight: number,
    boardWidth: number
}

export default class Controls extends Component<IControlsProps, IControlsState> {
    constructor(props: any) {
        super(props);
        this.state = {
            barrierType: NodeType.WallNode,
            boardHeight: 3,
            boardWidth: 3
        }
    }

    componentDidMount() {
        // Do this to fix error where can't use node types
        Node.createNode(1, 1);
    }

    changeBarrier(barrier: BarrierNode) {
        this.setState({ ...this.state, barrierType: barrier });
    }

    renderHeightChange() {
        return (<div className="adjust-size">
            <button className="up" onClick={() => this.setState({...this.state, boardHeight: this.state.boardHeight+1})}>^</button>
            <span>{this.state.boardHeight}</span>
            <button className="down" onClick={() => this.setState({...this.state, boardHeight: this.state.boardHeight-1})}>V</button>
        </div>)
    }

    renderWidthChange() {
        return (<div className="adjust-size">
            <button className="up" onClick={() => this.setState({...this.state, boardWidth: this.state.boardWidth+1})}>^</button>
            <span>{this.state.boardWidth}</span>
            <button className="down" onClick={() => this.setState({...this.state, boardWidth: this.state.boardWidth-1})}>V</button>
        </div>)
    }

    render() {
        return (<div>
            <div className="controls">
                <h1>Pathfinder</h1>
                <div className="placements">
                    <button onClick={() => this.changeBarrier(NodeType.WallNode)}>Wall</button>
                    <button onClick={() => this.changeBarrier(NodeType.ForestNode)}>Forest</button>
                    {this.renderHeightChange()}
                    {this.renderWidthChange()}
                </div>
            </div>
            <Board barrierType={this.state.barrierType}
            boardHeight={this.state.boardHeight}
            boardWidth={this.state.boardWidth} />
        </div>);
    }
}