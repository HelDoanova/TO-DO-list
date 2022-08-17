import React, {Component} from 'react';
import {ApiGet} from '../common/Api';
import TaskTable from './TaskTable';

export default class TaskIndex extends Component {

    constructor(props){
        super(props);

        this.state = {
            tasks: [],
            filter: "vse"
        };

        this.filter = () => {
            let filter = document.getElementById("filter");
            let selectedFilter = filter.options[filter.selectedIndex].value;
            this.setState((prevState) => ({
                tasksF: prevState.tasksF,
                filter: selectedFilter
            }))
            console.log(selectedFilter);
            
        };

        this.delete = this.delete.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    //PRIDANI API PRED TASK
    componentDidMount() {
        ApiGet('/api/tasks')
            .then(data => this.setState({tasks: data}));//this.setState({tasks: data})
        ApiGet('/api/tasks?complete=false').then(data => this.setState({ tasks: data }))
            .catch((error) => {
                console.log(error);
            });
        ApiGet('/api/tasks?complete=true').then(data => this.setState({ tasks: data })) 
            .catch((error) => {
                console.log(error);
            });
    }

    delete() {
        ApiGet('/api/tasks')
            .then(data => this.setState({tasks: data}));
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        const params = this.state.filter;
        ApiGet('/api/tasks', params)
            .then(data => this.setState({tasks: data}))

    }


    render() {

        return (
            <div>
                <h3>Seznam ukolu</h3>
                
                <hr />
                    <label htmlFor="filter">Zobrazit úkoly:</label>
                <hr />
                <select id="filter" onChange={this.filter}>
                    <option value="vse">Všechny</option>
                    <option value="incompleted">Nesplněné</option>
                    <option value="completed">Splněné</option>
                </select>                       
                <hr />
                <TaskTable delete={this.delete} items={this.state.tasks} filter={this.state.filter} label="Počet všech úkolu:" />
            </div>
        );
    }
}
