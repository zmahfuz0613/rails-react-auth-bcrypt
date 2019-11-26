import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
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
  verifyUser
} from './services/api-helper'

import './App.css';
import Header from './components/Header';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teachers: [],
      teacherForm: {
        name: "",
        photo: ""
      },
      currentUser: null,
      authFormData: {
        username: "",
        email: "",
        password: ""
      }
    };
  }

  async componentDidMount() {
    this.getTeachers();
    const currentUser = await verifyUser();
    if (currentUser) {
      this.setState({ currentUser })
    }
  }

  getTeachers = async () => {
    const teachers = await readAllTeachers();
    this.setState({
      teachers
    })
  }

  newTeacher = async (e) => {
    e.preventDefault();
    const teacher = await createTeacher(this.state.teacherForm);
    this.setState(prevState => ({
      teachers: [...prevState.teachers, teacher],
      teacherForm: {
        name: "",
        photo: ""
      }
    }))
  }

  editTeacher = async () => {
    const { teacherForm } = this.state
    await updateTeacher(teacherForm.id, teacherForm);
    this.setState(prevState => (
      {
        teachers: prevState.teachers.map(teacher => {
          return teacher.id === teacherForm.id ? teacherForm : teacher
        }),
      }
    ))
  }

  deleteTeacher = async (id) => {
    await destroyTeacher(id);
    this.setState(prevState => ({
      teachers: prevState.teachers.filter(teacher => teacher.id !== id)
    }))
  }

  handleFormChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      teacherForm: {
        ...prevState.teacherForm,
        [name]: value
      }
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

  // -------------- AUTH ------------------

  handleLoginButton = () => {
    this.props.history.push("/login")
  }

  handleLogin = async () => {
    const currentUser = await loginUser(this.state.authFormData);
    this.setState({ currentUser });
  }

  handleRegister = async (e) => {
    e.preventDefault();
    const currentUser = await registerUser(this.state.authFormData);
    this.setState({ currentUser });
  }

  handleLogout = () => {
    localStorage.removeItem("authToken");
    this.setState({
      currentUser: null
    })
  }

  authHandleChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      authFormData: {
        ...prevState.authFormData,
        [name]: value
      }
    }));
  }

  render() {
    return (
      <div className="App" >
        <Header
          handleLoginButton={this.handleLoginButton}
          handleLogout={this.handleLogout}
          currentUser={this.state.currentUser}
        />
        <Route exact path="/login" render={() => (
          <Login
            handleLogin={this.handleLogin}
            handleChange={this.authHandleChange}
            formData={this.state.authFormData} />)} />
        <Route exact path="/register" render={() => (
          <Register
            handleRegister={this.handleRegister}
            handleChange={this.authHandleChange}
            formData={this.state.authFormData} />)} />
        <Route
          exact path="/"
          render={() => (
            <TeachersView
              teachers={this.state.teachers}
              teacherForm={this.state.teacherForm}
              handleFormChange={this.handleFormChange}
              newTeacher={this.newTeacher} />
          )}
        />
        <Route
          path="/new/teacher"
          render={() => (
            <CreateTeacher
              handleFormChange={this.handleFormChange}
              teacherForm={this.state.teacherForm}
              newTeacher={this.newTeacher} />
          )} />
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
              deleteTeacher={this.deleteTeacher} />
          }}
        />
      </div>
    );
  }
}

export default withRouter(App);