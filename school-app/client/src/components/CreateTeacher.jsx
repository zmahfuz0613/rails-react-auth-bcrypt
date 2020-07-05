import React, { Component } from 'react';

class CreateTeacher extends Component {
  state = {
    name: "",
    photo: ""
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    })
  }

  render() {
    const { name, photo } = this.state;
    return (
      <div className="create-form" >
        <h2>Create a New Teacher</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          this.props.newTeacher(this.state);
          this.setState({
            name: "",
            photo: ""
          })
        }}>
          <label>
            Photo Link:
            <input
              type="text"
              name="photo"
              value={photo}
              onChange={this.handleChange}
            />
          </label>
          <label>
            Teacher's name:
            <input
              type="text"
              name="name"
              value={name}
              onChange={this.handleChange}
            />
          </label>
          <button>Submit</button>
        </form>
      </div >
    )
  }
}

export default CreateTeacher;
