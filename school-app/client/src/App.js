import React, { Component } from 'react';
import { Route } from 'react-router-dom';

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
} from './services/teachers';
import {
  loginUser,
  registerUser,
  verifyUser,
  removeToken
} from './services/auth';

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
    const newTeacher = await createTeacher(formData);
    this.setState(prevState => ({
      teachers: [...prevState.teachers, newTeacher],
    }))
  }

  editTeacher = async (id, formData) => {
    const updatedTeacher = await updateTeacher(id, formData);
    this.setState(prevState => ({
      teachers: prevState.teachers.map(teacher => {
        return teacher.id === id ? updatedTeacher : teacher
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
          render={(props) => (
            <TeachersView
              {...props}
              teachers={this.state.teachers}
              currentUser={this.state.currentUser}
            />
          )}
        />
        <Route
          path="/new/teacher"
          render={(props) => (
            <CreateTeacher
              {...props}
              newTeacher={this.newTeacher}
            />
          )}
        />
        <Route
          path="/teachers/:id"
          render={(props) => {
            const { id } = props.match.params;
            return <TeacherPage
              id={id}
              editTeacher={this.editTeacher}
              deleteTeacher={this.deleteTeacher}
              currentUser={this.state.currentUser}
            />
          }}
        />
      </div>
    );
  }
}

export default App;