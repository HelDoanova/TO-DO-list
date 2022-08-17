import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Link, Redirect, Route, Switch} from 'react-router-dom';

import TaskIndex from './components/TaskIndex';
import TaskDetail from './components/TaskDetail';
import TaskForm from './components/TaskForm';
import TaskForm2 from './components/TaskForm2';

import Navbar from './components/Navbar'
import Landing from './components/Landing'
import Login from './components/Login'
import Register from './components/Register'
import Unauthenticate from './components/Unauthenticate';
import Authenticate from './components/Authenticate';
import Cookies from "js-cookie";

class App extends Component { 

  checkLoginStatus() {
    if(Cookies.get("loggedIn")){
        return true;
    } else {
        return false;
    }
  }

    render(){
      return(
        <Router>
          <div className = "App">
            <Navbar />
            <Unauthenticate exact path = "/" component = {Landing} appProps={this.checkLoginStatus()} />
            <div className = "container">
              <Unauthenticate exact path="/register" component={ Register} appProps={this.checkLoginStatus()} />
              <Unauthenticate exact path="/login" component={ Login } appProps={this.checkLoginStatus()} />
              <Authenticate exact path="/tasks" component={ TaskIndex } appProps={this.checkLoginStatus()} />
              <Switch>
                    
                    <Authenticate path="/components/show/:id" component={TaskDetail} appProps={this.checkLoginStatus()} />
                    <Authenticate path="/components/create" component={ TaskForm } appProps={this.checkLoginStatus()} />
                    <Authenticate path="/components/edit/:id" component={ TaskForm2 } appProps={this.checkLoginStatus()} />
                </Switch>
            </div>
          </div>
        </Router>
      )
    }
}

export default App;

