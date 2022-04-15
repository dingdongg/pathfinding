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
    readonly MIN_HEIGHT: number = 3;
    readonly MAX_HEIGHT: number = 10;
    readonly MIN_WIDTH: number = 3;
    readonly MAX_WIDTH: number = 15;

    constructor(props: any) {
        super(props);
        this.state = {
            barrierType: NodeType.WallNode,
            boardHeight: 5,
            boardWidth: 9
        }
    }

    componentDidMount() {
        // Do this to fix error where can't use node types
        Node.createNode(1, 1);
    }

    changeBarrier(barrier: BarrierNode) {
        this.setState({ ...this.state, barrierType: barrier });
    }



    increaseHeight() {
        if (this.state.boardHeight >= this.MAX_HEIGHT) return;
        this.setState((state) => { return { boardHeight: state.boardHeight + 1 } })
    }

    decreaseHeight() {
        if (this.state.boardHeight <= this.MIN_HEIGHT) return;
        this.setState((state) => { return { boardHeight: state.boardHeight - 1 } })
    }

    increaseWidth() {
        if (this.state.boardWidth >= this.MAX_WIDTH) return;
        this.setState((state) => { return { boardWidth: state.boardWidth + 1 } })
    }

    decreaseWidth() {
        if (this.state.boardWidth <= this.MIN_WIDTH) return;
        this.setState((state) => { return { boardWidth: state.boardWidth - 1 } })
    }

    renderHeightChange() {
        return (<div className="adjust-height">
            <span>Height</span>
            <button className="up" onClick={() => this.increaseHeight()}>▲</button>
            <span>{this.state.boardHeight}</span>
            <button className="down" onClick={() => this.decreaseHeight()}>▼</button>
        </div>)
    }

    renderWidthChange() {
        return (<div className="adjust-width">
            <span className="descriptor">Width</span>
            <button className="left" onClick={() => this.decreaseWidth()}>◀</button>
            <span className="value">{this.state.boardWidth}</span>
            <button className="right" onClick={() => this.increaseWidth()}>▶</button>
        </div>)
    }

    render() {
        return (<div>
            <div className="header">
                <h1>Pathfinder</h1>
                <div className="controls">
                    <div className="barrier-types">
                        <button onClick={() => this.changeBarrier(NodeType.WallNode)}
                            className={this.state.barrierType == NodeType.WallNode ? "selected wall" : ""}>
                            River</button>
                        <button onClick={() => this.changeBarrier(NodeType.ForestNode)}
                            className={this.state.barrierType == NodeType.ForestNode ? "selected forest" : ""}>
                            Forest</button>
                    </div>
                    <div className="divider"></div>
                    <div>
                        Algorithms
                    </div>
                    <div className="divider"></div>
                    <div className="adjust-size">
                        {this.renderHeightChange()}
                        {this.renderWidthChange()}
                    </div>
                </div>
            </div>
            <Board barrierType={this.state.barrierType}
                newBoardHeight={this.state.boardHeight}
                newBoardWidth={this.state.boardWidth} />
        </div>);
    }
}