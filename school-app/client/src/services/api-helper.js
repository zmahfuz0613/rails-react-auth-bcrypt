import axios from 'axios';

const baseUrl = 'http://localhost:3000'

const api = axios.create({
  baseURL: baseUrl
})

export const loginUser = (loginData) => {
  const resp = api.port('/auth/login', loginData)
  return resp.data
}

export const registerUser = (registerData) => {
  const resp = api.post('/users/', registerData)
  return resp.data
}

const createTeacher = (data) => {
  const resp = api.post('/teachers', {teacher: data})
  return resp.data
}

const readAllTeachers = () => {
  return fetch(`${baseUrl}/teachers`)
    .then(resp => resp.json())
}

const updateTeacher = (id, data) => {
  const resp = api.put(`/teachers/${id}`, {teacher: data})
  return resp.data
}

const destroyTeacher = (id) => {
  const resp = api.delete(`/teachers/${id}`)
  return resp.data
}

export {
  createTeacher,
  readAllTeachers,
  updateTeacher,
  destroyTeacher
}