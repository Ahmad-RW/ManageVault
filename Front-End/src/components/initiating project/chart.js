import React, { Component } from 'react';
import {Bar, Line, Pie} from 'react-chartjs-2';

class Chart extends Component {
    // state = this.props.state
    render(){
        console.log(this.props.state)
        return (
            <div className="chart">
                <Pie data={this.props.state}/>

            </div>
        )
    }
}
export default Chart 