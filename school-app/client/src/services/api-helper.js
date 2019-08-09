import axios from 'axios';

const baseUrl = 'http://localhost:3000'

const api = axios.create({
  baseURL: baseUrl
})

export const loginUser = async(loginData) => {
  const resp = await api.port('/auth/login', loginData)
  return resp.data
}

export const registerUser = async(registerData) => {
  const resp = await api.post('/users/', registerData)
  return resp.data
}

const createTeacher = async(data) => {
  const resp = await api.post('/teachers', {teacher: data})
  return resp.data
}

const readAllTeachers = async() => {
  const resp = await api.get('/teachers')
  return resp.data
}

const updateTeacher = async(id, data) => {
  const resp = await api.put(`/teachers/${id}`, {teacher: data})
  return resp.data
}

const destroyTeacher = async(id) => {
  const resp = await api.delete(`/teachers/${id}`)
  return resp.data
}

export {
  createTeacher,
  readAllTeachers,
  updateTeacher,
  destroyTeacher
}