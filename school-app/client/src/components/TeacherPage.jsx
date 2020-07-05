import React, { Component } from 'react';
import EditTeacher from './EditTeacher'
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import { readOneTeacher } from '../services/api-helper';
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

  render() {
    const {
      history,
      editTeacher,
      deleteTeacher
    } = this.props;
    const { teacher } = this.state;
    return (
      <div className="teacher-page">
        {
          teacher ? <h2>Loading . . .</h2> : (
            <div>
              <img alt={teacher.name} src={teacher.photo} />
              <Route
                path='/teachers/:id/edit'
                render={() => (
                  <EditTeacher
                    editTeacher={editTeacher}
                    teacher={teacher}
                    history={history}
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
                  />
                )}
              />
            </div>)
        }
      </div>)
  }
}

export default withRouter(TeachersPage);