import React, { Component } from 'react';
import { Algorithm, Pathfinder, SearchedNode } from '../Pathfinding/Pathfinder';
import { Node, NodeType, BarrierNode, INodeProps } from "./Node";

// WHEN UPDATING BOARD DIMENSIONS, MAKE SURE TO UPDATE _board.scss AS WELL
// export const BOARD_HEIGHT = 3, BOARD_WIDTH = 10;
// export const INIT_START_ROW = 0, INIT_START_COL = 0, INIT_END_ROW = 0, INIT_END_COL = 3;
const EmptyNode = NodeType.EmptyNode, StartNode = NodeType.StartNode, EndNode = NodeType.EndNode, WallNode = NodeType.WallNode, ForestNode = NodeType.ForestNode;


// These enums used for moving/placing start, end, and walls
const enum Hold {
    HoldNone, HoldStart, HoldEnd, HoldBarrier
}

// These enums are used to denote the "animation" state of the board
const enum SearchState {
    None = 0,
    Animating = 1,
    Done = 2,
}

interface IBoardProps {
    barrierType: BarrierNode,
    algorithm: Algorithm,
    newBoardWidth: number,
    newBoardHeight: number
}

interface IBoardState {
    grid: INodeProps[],
    mouseDown: boolean,
    holdType: Hold,
    boardHeight: number,
    boardWidth: number,
    searchState: SearchState, // Current state of search animation
    showDist: boolean,
}


export default class Board extends Component<IBoardProps, IBoardState> {
    constructor(props: IBoardProps) {
        super(props);
        this.state = {
            grid: [],
            mouseDown: false,
            holdType: Hold.HoldNone,
            boardHeight: props.newBoardHeight,
            boardWidth: props.newBoardWidth,
            searchState: SearchState.None,
            showDist: false,
        }
    }

    // Initializes grid state
    initGrid() {
        this.setState({
            boardHeight: this.props.newBoardHeight,
            boardWidth: this.props.newBoardWidth,
            grid: this.createInitGrid(this.props.newBoardHeight, this.props.newBoardWidth),
            searchState: SearchState.None,
        }
        );
    }

    // Creates and returns starting grid
    createInitGrid(height: number, width: number): INodeProps[] {
        const grid = new Array<INodeProps>();
        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                grid.push(Node.createNode(row, col));
            }
        }
        const startRow: number = Math.floor(height / 2);
        grid[startRow * width + Math.floor(width * 1 / 4)].nodeType = NodeType.StartNode;
        grid[startRow * width + Math.ceil(width * 3 / 4) - 1].nodeType = NodeType.EndNode;
        return grid;
    }

    componentDidMount() {
        this.initGrid();
    }

    handleMouseDown(row: number, col: number) {
        if (this.state.searchState !== SearchState.None) return;
        const newState = { ...this.state, mouseDown: true };
        const nodeType = this.getNode(this.state.grid, row, col).nodeType;
        switch (nodeType) {
            case StartNode:
                newState.holdType = Hold.HoldStart;
                break;
            case EndNode:
                newState.holdType = Hold.HoldEnd;
                break;
            default:
                newState.holdType = Hold.HoldBarrier;
                this.modifyGridBarrier(this.state.grid, row, col, this.props.barrierType);
                newState.grid = this.state.grid;
                break;
        }
        this.setState(newState);
    }

    handleMouseEnter(row: number, col: number) {
        if (!this.state.mouseDown) return;

        const grid = this.state.grid;
        const holdType = this.state.holdType;
        const nodeType = this.getNode(grid, row, col).nodeType;
        if (holdType === Hold.HoldStart && nodeType === NodeType.EmptyNode) {
            this.modifyGridStart(grid, row, col);
        } else if (holdType === Hold.HoldEnd && nodeType === NodeType.EmptyNode) {
            this.modifyGridEnd(grid, row, col);
        } else if (holdType === Hold.HoldBarrier && (nodeType !== NodeType.StartNode && nodeType !== NodeType.EndNode)) {
            this.modifyGridBarrier(grid, row, col, this.props.barrierType);
        }
        this.setState({ grid: grid });
    }

    handleMouseUp() {
        const newState = { mouseDown: false, holdType: Hold.HoldNone };
        this.setState(newState);
    }


    // Behaviours
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Gets the node at the provided row and col number
    getNode(grid: any[], row: number, col: number): INodeProps {
        if (row >= this.state.boardHeight || col >= this.state.boardWidth || row < 0 || col < 0) { throw new Error("Invalid row or column (" + row + ", " + col + ").") };
        return grid[row * this.state.boardWidth + col];
    }

    // Given a grid, makes the start node at the specified row and col
    // Ensures that all other nodes are not starting nodes
    modifyGridStart(grid: any[], row: number, col: number) {
        for (const node of grid) {
            if (node.nodeType === StartNode) { node.nodeType = EmptyNode; break; }
        }
        this.getNode(grid, row, col).nodeType = StartNode;
    }

    // Given a grid, makes the end node at the specified row and col
    // Ensures that all other nodes are not end nodes
    modifyGridEnd(grid: any[], row: number, col: number) {
        for (const node of grid) {
            if (node.nodeType === EndNode) { node.nodeType = EmptyNode; break; }
        }
        this.getNode(grid, row, col).nodeType = EndNode;
    }

    // Takes the node at the provided row/col, and makes it into BarrierType.
    // Assumes the provided node is not a start or end node
    modifyGridBarrier(grid: any[], row: number, col: number, barrierType: BarrierNode) {
        const node = this.getNode(grid, row, col);
        // Setting node type
        if (node.nodeType == barrierType) {
            Node.setType(node, NodeType.EmptyNode);
        } else {
            Node.setType(node, barrierType);
        }
        

        // Modifying surrounding wall classes
        for (let x = row - 1; x <= row + 1; x++) {
            for (let y = col - 1; y <= col + 1; y++) {
                try {
                    this.getNode(grid, x, y).barrierSegments = this.getBarrierSegments(grid, x, y);
                } catch (e) {
                    // Out of bounds exception. Do nothing
                }
            }
        }

    }

    // Assuming the node at the specified row and col is a barrier, will return its corresponding "barrier class"
    // Used for css purposes
    getBarrierSegments(grid: any[], row: number, col: number) {
        const barrierType = this.getNode(grid, row, col).nodeType;
        let ret = new Array(9);
        ret[4] = true;

        // First do direct edges
        for (let i = 1; i < ret.length; i += 2) {
            try {
                switch (i) {
                    case 1:
                        ret[i] = this.getNode(grid, row - 1, col).nodeType === barrierType;
                        break;
                    case 3:
                        ret[i] = this.getNode(grid, row, col - 1).nodeType === barrierType;
                        break;
                    case 5:
                        ret[i] = this.getNode(grid, row, col + 1).nodeType === barrierType;
                        break;
                    case 7:
                        ret[i] = this.getNode(grid, row + 1, col).nodeType === barrierType;
                        break;
                    default:
                }
            } catch (e) {
                // Out of bounds exception. Do nothing
            }
        }

        // Then handle corners
        for (let i = 0; i < ret.length; i += 2) {
            try {
                switch (i) {
                    case 0:
                        ret[i] = ret[1] && ret[3] && this.getNode(grid, row - 1, col - 1).nodeType === barrierType;
                        break;
                    case 2:
                        ret[i] = ret[1] && ret[5] && this.getNode(grid, row - 1, col + 1).nodeType === barrierType;
                        break;
                    case 6:
                        ret[i] = ret[3] && ret[7] && this.getNode(grid, row + 1, col - 1).nodeType === barrierType;
                        break;
                    case 8:
                        ret[i] = ret[5] && ret[7] && this.getNode(grid, row + 1, col + 1).nodeType === barrierType;
                        break;
                    default:
                }
            } catch (e) {
                // Out of bounds exception. Do nothing
            }
        }
        return ret;
    }

    // Finds shortest path and animates it
    findPath() {
        const pathfinder = Pathfinder.createPathfinder(this.props.algorithm, this.state.boardHeight, this.state.boardWidth);
        const path = pathfinder.findPath(this.state.grid);
        // Need to reset state of board for animation
        softResetGrid(this.state.grid);
        this.setState({ searchState: SearchState.Animating });

        const searchOrder = path.searchOrder, shortestPath = path.shortestPath;
        if (searchOrder.length > 0) {
            setTimeout(() => { this.setState({ searchState: SearchState.Animating }) }, 0);
            setTimeout(() => { this.animateSearch(searchOrder, shortestPath, 0) }, 0);
        }
    }





    // Rendering and animation
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Animates the "next"th node in the searchedNodes
    // Hold "shortestPath" so can start shortest path animation when search is done
    animateSearch(searchOrder: SearchedNode[], shortestPath: number[], next: number) {
        if (this.state.searchState !== SearchState.Animating) return; // Edge case where board reset before animation done
        const grid = this.state.grid;
        grid[searchOrder[next].index].visited = true;
        grid[searchOrder[next].index].distance = searchOrder[next].distance;
        this.setState({ grid: grid });
        next++;
        if (next < searchOrder.length) {
            setTimeout(() => { this.animateSearch(searchOrder, shortestPath, next) }, 40);
        } else {
            setTimeout(() => { this.animatePath(shortestPath, 0) }, 40);
        }
    }

    // Animates the "next"th node in the shortestPath
    animatePath(shortestPath: number[], next: number) {
        if (this.state.searchState !== SearchState.Animating) return; // Edge case where board reset before animation done
        const grid = this.state.grid;
        grid[shortestPath[next]].isPath = true;
        this.setState({ grid: grid });
        next++;
        if (next < shortestPath.length) {
            setTimeout(() => { this.animatePath(shortestPath, next) }, 100);
        } else {
            this.setState({ searchState: SearchState.Done });
        }
    }

    // Given a "node", returns it rendered as HTML
    renderNode(node: INodeProps) {
        const index = node.row * this.state.boardWidth + node.col;
        return <Node key={index} row={node.row} col={node.col} nodeType={node.nodeType} barrierSegments={node.barrierSegments}
            onMouseDown={(row: number, col: number) => this.handleMouseDown(row, col)}
            onMouseEnter={(row: number, col: number) => this.handleMouseEnter(row, col)}
            onMouseUp={() => this.handleMouseUp()}
            showDist={this.state.showDist}
            visited={node.visited}
            isPath={node.isPath}
            weight={node.weight}
            prev={node.prev}
            distance={node.distance} />
    }

    // "row" is an array of HTML "rendered" nodes (from renderNode). Renders them as a row
    // "rowN" is the row number
    renderRow(row: any[], rowN: number) {
        return <div key={rowN} className="board-row">{row}</div>
    }

    renderBoard() {
        const grid = [];
        let currRow = [];
        let rowN: number = 0;//Keeps track of current row number
        for (const node of this.state.grid) {
            currRow.push(this.renderNode(node));
            if (currRow.length % this.state.boardWidth == 0) {
                grid.push(this.renderRow(currRow, rowN));
                rowN++;
                currRow = [];
            }
        }
        return <div className="board" onMouseLeave={() => this.handleMouseUp()}>{grid}</div>
    }

    private renderShowDistBtn() {
        return (<button onClick={() => this.setState({...this.state, showDist: !this.state.showDist})}
                className={this.state.showDist == true ? "show-dist" : "show-dist-off"}>
                Display Distance </button>)
    }

    render() {
        return (
            <div>
                <div className="board-buttons">
                    {this.renderShowDistBtn()}
                    <button onClick={() => this.findPath()} className="find-path">Find Path</button>
                    <button onClick={() => { softResetGrid(this.state.grid); this.setState({ "searchState": SearchState.None }) }} className="soft-reset">Soft Reset</button>
                    <button onClick={() => this.initGrid()} className="reset">Reset</button>
                </div>
                {this.renderBoard()}
            </div>
        );
    }
}







// Resets state of board, but keeps nodeTypes the same
function softResetGrid(grid: any[]) {
    for (const node of grid) {
        node.visited = false;
        node.prev = null;
        node.distance = Infinity;
        node.isPath = false;
    }
}