import React, {Component} from 'react';
import InputField from "../common/InputField";
import FlashMessage from '../common/FlashMessage';
import {ApiGet, ApiPost} from '../common/Api';
import { Link } from 'react-router-dom';


export default class TaskForm extends Component {



    constructor(props) {
        // inicializace hodnot
        super(props);

        this.state = {
            _id: null,
            taskName: '',
            complete: false,
    
            sent: false,
            success: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        // obsluha vstupů formuláře
        const target = e.target;

        let temp;
        temp = target.value;
       
        const name = target.name;
        const value = temp;
    
        this.setState({
            [name]: value,
        });
    }

    handleSubmit(e) {
        // obsluha odeslání formuláře
        e.preventDefault();

        const body = {
            taskName: this.state.taskName,
            complete: this.state.complete,
        }
        console.log(body);
     
        ApiPost('/api/tasks/', body)               
            .then((data) => {
                this.setState({
                    sent: true,
                    success: true,
                });
            }).catch((error) => {
                console.error(error);
    
                this.setState({
                    sent: true,
                    success: false,
                });
            });

    }

    componentDidMount() {
        // načtení existujícího záznamu
        const id = this.props.match.params.id || null;
        if (id) {
            this.setState({_id: id});
            ApiGet('/api/tasks/' + id)              
                .then(data => {
                    this.setState({
                        taskName: data.taskName,
                        complete: data.complete,
                    })
                });
        }
    }

    render() {
        // vykreslení formuláře
        const sent = this.state.sent;
        const success = this.state.success;
    
        return (
            <div>
                <h1>Zadat task</h1><hr/>
    
                {sent && <FlashMessage theme={success ? 'success' : 'danger'}
                                       text={success ? 'Ukol uspěšně vytvořen.' : 'Chyba při vytváření úkolu.'}/>}
    
                <form onSubmit={this.handleSubmit}>
                    <InputField required={true} type="text" name="taskName" min="3"
                        label="Název" prompt="Zadejte úkol"
                        value={this.state.taskName} handleChange={this.handleChange}/>

                    <input type="submit" className="btn btn-primary" value="Uložit"/>
                </form>
                <p></p>
                <div className="btn-group">
                        <Link to={"/tasks"}
                            className="btn btn-sm btn-info">Zpět</Link>
                </div>

            </div>         
        )
    }

}