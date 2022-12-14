import React, { Component } from 'react'
import { login } from './UserFunctions'
import FlashMessage from '../common/FlashMessage';


class Login extends Component {
  constructor() {
    super()
    this.state = {
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

    const user = {
      email: this.state.email,
      password: this.state.password
    }

    login(user).then(res => {
      if (res) {
        this.props.history.push(`/tasks`)
        window.location.reload();
      }
      this.setState({
        sent: true,
        success: false,
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
                                 text={success ? 'Uspesne prihlaseni' : 'Spatny email nebo heslo'}/>}

            <form noValidate onSubmit={this.onSubmit}>
              <h1 className="h3 mb-3 font-weight-normal">Přihlašte se</h1>
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
                Log in
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Login