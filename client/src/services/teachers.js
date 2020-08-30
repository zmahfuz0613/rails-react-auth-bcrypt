import api from './api-config';

export const createTeacher = async (data) => {
  const resp = await api.post('/teachers', { teacher: data })
  return resp.data
}

export const readAllTeachers = async () => {
  const resp = await api.get('/teachers')
  return resp.data
}

export const readOneTeacher = async (id) => {
  const resp = await api.get(`/teachers/${id}`);
  return resp.data
}

export const updateTeacher = async (id, data) => {
  const resp = await api.put(`/teachers/${id}`, { teacher: data })
  return resp.data
}

export const destroyTeacher = async (id) => {
  const resp = await api.delete(`/teachers/${id}`)
  return resp.data
}