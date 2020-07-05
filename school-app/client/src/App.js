import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router';

import TeachersView from './components/TeachersView';
import TeacherPage from './components/TeacherPage';
import CreateTeacher from './components/CreateTeacher'
import Login from './components/Login'
import Register from './components/Register'

import {
  createTeacher,
  readAllTeachers,
  updateTeacher,
  destroyTeacher,
  loginUser,
  registerUser,
  verifyUser,
  removeToken
} from './services/api-helper'

import './App.css';
import Header from './components/Header';

class App extends Component {
  state = {
    teachers: [],
    teacherForm: {
      name: "",
      photo: ""
    },
    currentUser: null,
  }


  // =======================================
  // ============= Life Cycles =============
  // =======================================

  componentDidMount() {
    this.getTeachers();
    this.handleVerify();
  }

  // =======================================
  // =============  Teachers   =============
  // =======================================

  getTeachers = async () => {
    const teachers = await readAllTeachers();
    this.setState({
      teachers
    })
  }

  newTeacher = async (formData) => {
    const teacher = await createTeacher(formData);
    this.setState(prevState => ({
      teachers: [...prevState.teachers, teacher],
    }))
  }

  editTeacher = async () => {
    const { teacherForm } = this.state
    await updateTeacher(teacherForm.id, teacherForm);
    this.setState(prevState => ({
      teachers: prevState.teachers.map(teacher => {
        return teacher.id === teacherForm.id ? teacherForm : teacher
      }),
    }))
  }

  deleteTeacher = async (id) => {
    await destroyTeacher(id);
    this.setState(prevState => ({
      teachers: prevState.teachers.filter(teacher => teacher.id !== id)
    }))
  }

  mountEditForm = async (id) => {
    const teachers = await readAllTeachers();
    const teacher = teachers.find(el => el.id === parseInt(id));
    this.setState({
      teacherForm: teacher
    });
  }

  resetForm = () => {
    this.setState({
      teacherForm: {
        name: "",
        photo: ""
      }
    })
  }

  // =======================================
  // =============    Auth     =============
  // =======================================

  handleLogin = async (formData) => {
    const currentUser = await loginUser(formData);
    this.setState({ currentUser });
  }

  handleRegister = async (formData) => {
    const currentUser = await registerUser(formData);
    this.setState({ currentUser });
  }

  handleVerify = async () => {
    const currentUser = await verifyUser();
    this.setState({ currentUser })
  }

  handleLogout = () => {
    localStorage.removeItem("authToken");
    removeToken();
    this.setState({
      currentUser: null
    })
  }

  // =======================================
  // =============   Render    =============
  // =======================================

  render() {
    return (
      <div className="App" >
        <Header
          handleLoginButton={this.handleLoginButton}
          handleLogout={this.handleLogout}
          currentUser={this.state.currentUser}
        />
        <Route
          exact path="/login"
          render={() => (
            <Login
              handleLogin={this.handleLogin}
            />
          )}
        />
        <Route
          exact path="/register"
          render={() => (
            <Register
              handleRegister={this.handleRegister}
            />
          )}
        />
        <Route
          exact path="/"
          render={() => (
            <TeachersView
              teachers={this.state.teachers}
              teacherForm={this.state.teacherForm}
              handleFormChange={this.handleFormChange}
              newTeacher={this.newTeacher}
            />
          )}
        />
        <Route
          path="/new/teacher"
          render={(props) => (
            <CreateTeacher
              {...props}
              handleFormChange={this.handleFormChange}
              teacherForm={this.state.teacherForm}
              newTeacher={this.newTeacher}
            />
          )}
        />
        <Route
          path="/teachers/:id"
          render={(props) => {
            const { id } = props.match.params;
            const teacher = this.state.teachers.find(el => el.id === parseInt(id));
            return <TeacherPage
              id={id}
              teacher={teacher}
              handleFormChange={this.handleFormChange}
              mountEditForm={this.mountEditForm}
              editTeacher={this.editTeacher}
              teacherForm={this.state.teacherForm}
              deleteTeacher={this.deleteTeacher}
            />
          }}
        />
      </div>
    );
  }
}

export default withRouter(App);