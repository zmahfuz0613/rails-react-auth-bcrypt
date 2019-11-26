import React, { Component } from 'react';
import EditTeacher from './EditTeacher'
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router';

class TeachersPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false
    }
  }

  componentDidMount() {
    this.props.mountEditForm(this.props.id);
  }

  render() {
    const { teacher } = this.props;
    return (
      <div className="teacher-page">
        {teacher === undefined ? <h2>Loading . . .</h2> : (
          <div>
            <img alt={teacher.name} src={teacher.photo} />
            {this.state.isEdit ?
              <Route path={'/teachers/:id/edit'} render={() => (
                <EditTeacher
                  handleFormChange={this.props.handleFormChange}
                  handleSubmit={(e) => {
                    e.preventDefault();
                    this.props.editTeacher();
                    this.setState({ isEdit: false })
                    this.props.history.push(`/teachers/${this.props.teacherForm.id}`)
                  }}
                  teacherForm={this.props.teacherForm} />
              )} />
              :
              <>
                <h1>{teacher.name}</h1>
                <button onClick={() => {
                  this.setState({
                    isEdit: true
                  })
                  this.props.history.push(`/teachers/${teacher.id}/edit`)
                }}>Edit</button>
                <button onClick={() => {
                  this.props.deleteTeacher(teacher.id);
                  this.props.history.push('/')
                }}>Delete</button>
              </>
            }
          </div>)}
      </div>)
  }
}

export default withRouter(TeachersPage);