import React, { Component } from 'react';

export default class Controls extends Component {

    render() {
        return (<div className="controls">
            <h1>Pathfinder</h1>
            <div className="placements">
                <button>Wall</button>
                <button>Forest</button>
            </div>
        </div>);
    }
}