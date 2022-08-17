import React, { Component } from 'react'
import { register } from './UserFunctions'
import FlashMessage from '../common/FlashMessage';

class Register extends Component {
  constructor() {
    super()
    this.state = {
        //_id: new mongoose.Types.ObjectId,
      email: '',
      password: '',
      errors: {},
      sent: false,
      success: false,
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }
  onSubmit(e) {
    e.preventDefault()

    const newUser = {
      email: this.state.email,
      password: this.state.password
    }

    register(newUser).then(res => {
      this.props.history.push(`/login`);
        
        this.setState({
            sent: true,
            success: true,
        });
      
    }).catch(err  =>{
        this.setState({
            sent: true,
            success: false,
        });
    })  
  }

  render() {

    const sent = this.state.sent;
    const success = this.state.success;

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5 mx-auto">

          {sent && <FlashMessage theme={success ? 'success' : 'danger'}
                                 text={success ? 'Úspěšná registrace' : 'Registrace selhala. Zkus to znovu.(špatně zadaná emailová adresa nebo tato emailová adresa je již registrovaná)'}/>}

            <form noValidate onSubmit={this.onSubmit}>
              <h1 className="h3 mb-3 font-weight-normal">Registrace</h1>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Enter email"
                  value={this.state.email}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.onChange}
                />
              </div>
              <button
                type="submit"
                className="btn btn-lg btn-primary btn-block"
              >
                Register!
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Register