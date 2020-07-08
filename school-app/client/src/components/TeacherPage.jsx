import React, { Component } from 'react';
import EditTeacher from './EditTeacher'
import { Route } from 'react-router-dom';
import { readOneTeacher } from '../services/teachers';
import TeacherInfo from './TeacherInfo';

class TeachersPage extends Component {
  state = {
    isEdit: false,
    teacher: null
  }


  componentDidMount() {
    if (this.props.id) {
      this.getTeacher();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      this.getTeacher();
    }
  }

  getTeacher = async () => {
    const teacher = await readOneTeacher(this.props.id);
    this.setState({ teacher });
  }

  updateSingleTeacher = (formData) => {
    this.setState(prevState => ({
      teacher: {
        ...prevState.teacher,
        ...formData
      }
    }))
  }

  render() {
    const {
      deleteTeacher,
      currentUser,
      editTeacher,
      history,
      id
    } = this.props;
    const { teacher } = this.state;
    return (
      <div className="teacher-page">
        {
          teacher ? (
            <div>
              <img alt={teacher.name} src={teacher.photo} />
              <Route
                path='/teachers/:id/edit'
                render={() => (
                  <EditTeacher
                    updateSingleTeacher={this.updateSingleTeacher}
                    editTeacher={editTeacher}
                    teacher={teacher}
                    history={history}
                    id={id}
                  />
                )}
              />
              <Route
                exact path='/teachers/:id'
                render={() => (
                  <TeacherInfo
                    teacher={teacher}
                    history={history}
                    deleteTeacher={deleteTeacher}
                    currentUser={currentUser}
                  />
                )}
              />
            </div>
          ) : <h2>Loading . . .</h2>
        }
      </div>)
  }
}

export default TeachersPage;