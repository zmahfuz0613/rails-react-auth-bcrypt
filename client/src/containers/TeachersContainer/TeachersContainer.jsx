import React, { useState, useEffect } from 'react'
import { Switch, Route, useHistory } from 'react-router-dom';
import Teachers from '../../screens/Teachers/Teachers';
import TeacherCreate from '../../screens/TeacherCreate/TeacherCreate';
import TeacherDetail from '../../screens/TeacherDetail/TeacherDetail';
import { readAllTeachers, createTeacher, updateTeacher, destroyTeacher } from '../../services/teachers';

export default function TeachersContainer(props) {
  const [teachers, setTeachers] = useState([]);
  const history = useHistory();
  const { currentUser } = props;

  useEffect(() => {
    const fetchTeachers = async () => {
      const teachers = await readAllTeachers();
      setTeachers(teachers);
    }
    fetchTeachers();
  }, [])

  const newTeacher = async (formData) => {
    const newTeacher = await createTeacher(formData);
    setTeachers(prevState => [...prevState, newTeacher]);
    history.push('/');
  }

  const editTeacher = async (id, formData) => {
    const updatedTeacher = await updateTeacher(id, formData);
    setTeachers(prevState => prevState.map(teacher => {
      return teacher.id === Number(id) ? updatedTeacher : teacher
    }))
    history.push(`/${id}`);
  }

  const deleteTeacher = async (id) => {
    await destroyTeacher(id);
    setTeachers(prevState => prevState.filter(teacher => {
      return teacher.id !== id
    }))
    history.push('/');
  }

  return (
    <Switch>
      <Route path='/new'>
        <TeacherCreate
          newTeacher={newTeacher}
        />
      </Route>
      <Route path='/:id'>
        <TeacherDetail
          deleteTeacher={deleteTeacher}
          currentUser={currentUser}
          editTeacher={editTeacher}
          teachers={teachers}
        />
      </Route>
      <Route path='/'>
        <Teachers
          currentUser={currentUser}
          teachers={teachers}
        />
      </Route>
    </Switch>
  )
}
