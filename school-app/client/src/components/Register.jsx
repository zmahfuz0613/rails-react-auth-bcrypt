import React, { Component } from 'react';

// This component handles our register form
class Register extends Component {
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
    const { username, email, password } = this.state;
    return (
      <div className="auth-container">
        <h2>Register</h2>
        <hr />
        <form onSubmit={(e) => {
          e.preventDefault();
          this.props.handleRegister(this.state);
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
            Email:
            <input
              name="email"
              type="text"
              value={email}
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
          <button>Register</button>
        </form>
      </div>
    );
  }
}

export default Register;
