import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import {ApiDelete, ApiGet} from '../common/Api';

export default class TaskTable extends Component {
    
    delete(id) {
        ApiDelete('/api/tasks/' + id)       
            .then(data => console.log(data));

        this.props.delete();
    }  

/*
        //PRIDANI API PRED TASK
        componentDidMount() {
            console.log(this.props.items);
        }*/

    
    render() {
        
            return(
            <div>
                <p>{this.props.label} {this.props.items.length}</p>
                

                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Název</th>
                        <th>Akce</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.filter === 'vse' &&  
                        this.props.items.map((item, index) =>
                            <tr key={index + 1}>
                                <td>{index + 1}</td>
                                <td>{item.taskName}</td>
                                <div className="btn-group">
                                    <Link to={"/components/show/" + item._id}
                                        className="btn btn-sm btn-info">Stav</Link>
                                    <Link to={"/components/edit/" + item._id}
                                        className="btn btn-sm btn-warning">Upravit</Link>
                                    <button onClick={this.delete.bind(this, item._id)}
                                        className="btn btn-sm btn-danger">Odstranit
                                    </button>
                                    
                                </div>
                            </tr>
                        )
                        
                    }

                    {
                    this.props.filter === 'completed' &&                                      
                    this.props.items.map((item, index) =>
                        item.complete === true &&
                        <tr key={index + 1}>
                            <td>{index + 1}</td>
                            <td>{item.taskName}</td>
                            <div className="btn-group">
                                <Link to={"/components/show/" + item._id}
                                    className="btn btn-sm btn-info">Stav</Link>
                                <Link to={"/components/edit/" + item._id}
                                    className="btn btn-sm btn-warning">Upravit</Link>
                                <button onClick={this.delete.bind(this, item._id)}
                                    className="btn btn-sm btn-danger">Odstranit
                                </button>                                
                            </div>
                        </tr>
                    )

                    }

                {

                this.props.filter === 'incompleted' && 
                       
                this.props.items.map((item, index) =>
                item.complete === false &&
                    <tr key={index + 1}>
                        <td>{index + 1}</td>
                        <td>{item.taskName}</td>
                        <div className="btn-group">
                            <Link to={"/components/show/" + item._id}
                                className="btn btn-sm btn-info">Stav</Link>
                            <Link to={"/components/edit/" + item._id}
                                className="btn btn-sm btn-warning">Upravit</Link>
                            <button onClick={this.delete.bind(this, item._id)}
                                className="btn btn-sm btn-danger">Odstranit
                            </button>                           
                        </div>
                    </tr>
                )
                }




                    </tbody>
                </table>
                <Link to={"/components/create"} className="btn btn-success">Nový úkol</Link>
            </div>
            )
        
    }

}
