import React, { Component } from 'react';

class EditTeacher extends Component {
  state = {
    name: "",
    photo: ""
  }

  componentDidMount() {
    if (props.teacher) {
      this.setFormData();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.state.teacher !== prevProps.teacher) {
      this.setFormData();
    }
  }

  setFormData = () => {
    const { name, photo } = props.teacher;
    this.setState({ name, photo })
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    })
  }

  render() {
    const { editTeacher, history, id } = this.props;
    const { name, photo } = this.state;
    return (
      <div>
        <h3>Update Teacher</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          editTeacher(this.state);
          this.setState({
            name: "",
            photo: ""
          })
          history.push(`/teachers/${id}`)
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
      </div>
    )
  }
}

export default EditTeacher;
