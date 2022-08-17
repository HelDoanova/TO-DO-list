import React, {Component} from 'react';
import InputField from "../common/InputField";
import InputCheck from "../common/InputCheck";
import FlashMessage from '../common/FlashMessage';
import {ApiGet, ApiPut} from '../common/Api';
import { Link } from 'react-router-dom';


export default class TaskForm2 extends Component {



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
        
        if (target.name === 'complete') {
            temp = target.checked;
            console.log(temp)
        }
        else {                              
            temp = target.value;
        }
        
       
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
        };
        console.log(body);
    ApiPut('/api/tasks/' + this.props.match.params.id, body)             
            .then((data) => {
                console.log(data);
    
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
                <h1>Vlož změny</h1><hr/>
    
                {sent && <FlashMessage theme={success ? 'success' : 'danger'}
                                       text={success ? 'Změny provedeny.' : 'Chyba při ukládání změn.'}/>}
    
                <form onSubmit={this.handleSubmit}>
                    <InputField required={true} type="text" name="taskName" min="3"
                        label="Zadej nový název" prompt="Zadejte název"
                        value={this.state.taskName} handleChange={this.handleChange}/>
                    <h5>   
                    <strong>
                    <InputCheck type="checkbox" name="complete" label= "Splnit"
                        value={this.state.complete} handleChange={this.handleChange}/>
                    </strong>
                    </h5> 
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