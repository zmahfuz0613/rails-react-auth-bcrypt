import React, { Component } from 'react';
import { Link } from 'react-router-dom';


// This component handles our login form and has a link to the register form
class Login extends Component {
  state = {
    username: "",
    password: ""
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    })
  }

  render() {
    const { username, password } = this.state;

    return (
      <div className="auth-container" >
        <h2>login</h2>
        <hr />
        <form onSubmit={(e) => {
          e.preventDefault();
          this.props.handleLogin(this.state);
        }} >
          <label>
            Username:
            <input
              name="username"
              type="text"
              value={username}
              onChange={this.handleChange}
            />
          </label>
          <label>
            Password:
            <input
              name="password"
              type="password"
              value={password}
              onChange={this.handleChange}
            />
          </label>
          <hr />
          <button>Login</button>
          <Link to="/register">Register</Link>
        </form>
      </div>
    );
  }
}

export default Login;
