import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import decode from 'jwt-decode';

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
  registerUser
} from './services/api-helper'

import './App.css';

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
    this.handleFormChange = this.handleFormChange.bind(this)
    this.mountEditForm = this.mountEditForm.bind(this)
    this.editTeacher = this.editTeacher.bind(this)
    this.deleteTeacher = this.deleteTeacher.bind(this)
    this.newTeacher = this.newTeacher.bind(this)
    this.handleLoginButton = this.handleLoginButton.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.handleRegister = this.handleRegister.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.authHandleChange = this.authHandleChange.bind(this)
  }

  componentDidMount() {
    this.getTeachers();
    const checkUser = localStorage.getItem("jwt");
    if (checkUser) {
      const user = decode(checkUser);
      this.setState({
        currentUser: user
      })
    }
  }

  async getTeachers() {
    const teachers = await readAllTeachers();
    this.setState({
      teachers
    })
  }

  async newTeacher(e) {
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

  async editTeacher() {
    const { teacherForm } = this.state
    await updateTeacher(teacherForm.id, teacherForm);
    this.setState(prevState => (
      {
        teachers: prevState.teachers.map(teacher => teacher.id === teacherForm.id ? teacherForm : teacher),
      }
    ))
  }

  async deleteTeacher(id) {
    await destroyTeacher(id);
    this.setState(prevState => ({
      teachers: prevState.teachers.filter(teacher => teacher.id !== id)
    }))
  }

  handleFormChange(e) {
    const { name, value } = e.target;
    this.setState(prevState => ({
      teacherForm: {
        ...prevState.teacherForm,
        [name]: value
      }
    }))
  }

  async mountEditForm(id) {
    const teachers = await readAllTeachers();
    const teacher = teachers.find(el => el.id === parseInt(id));
    this.setState({
      teacherForm: teacher
    });
  }

  // -------------- AUTH ------------------

  handleLoginButton() {
    this.props.history.push("/login")
  }

  async handleLogin() {
    const userData = await loginUser(this.state.authFormData);
    this.setState({
      currentUser: decode(userData.token)
    })
    localStorage.setItem("jwt", userData.token)
  }

  async handleRegister(e) {
    e.preventDefault();
    await registerUser(this.state.authFormData);
    this.handleLogin();
  }

  handleLogout() {
    localStorage.removeItem("jwt");
    this.setState({
      currentUser: null
    })
  }

  authHandleChange(e) {
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
      <div className="App">
        <header>
          <h1><Link to='/' onClick={() => this.setState({
            teacherForm: {
              name: "",
              photo: ""
            }
          })}>School App</Link></h1>
          <div>
          {this.state.currentUser
            ?
            <>
              <p>{this.state.currentUser.username}</p>
              <button onClick={this.handleLogout}>logout</button>
            </>
            :
            <button onClick={this.handleLoginButton}>Login/register</button>
          }
          </div>
        </header>
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