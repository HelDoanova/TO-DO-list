import React, { Component } from 'react';
import { ApiGet } from '../common/Api';
import { Link } from 'react-router-dom';


export default class TaskDetail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            taskName: '',
            complete: false,
            
        }
    }

    componentDidMount() {
        ApiGet('/api/tasks/' + this.props.match.params.id)          //PRIDANI API
            .then(data => this.setState({
                taskName: data.taskName,
                complete: data.complete,
            }),console.log(this.state))
            .catch((error) => {
                console.error(error);
            });
    }

    render() {

        return (
            <div>
                <h1>Detail úkolu</h1><hr />
                <h3>{this.state.taskName}</h3>
                <p>
                    <strong>Dokončeno: </strong>{this.state.complete ? 'ANO' : 'NE'}<br/>
                </p>
                <p></p>
                <div className="btn-group">
                        <Link to={"/tasks"}
                            className="btn btn-sm btn-info">Zpět</Link>
                </div>


            </div>
        )
    }

}