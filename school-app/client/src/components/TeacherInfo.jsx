import React from 'react'
import { Link } from 'react-router-dom';

export default function TeacherInfo(props) {
  const { teacher, deleteTeacher, history, currentUser } = props;
  return (
    <>
      <h1>{teacher.name}</h1>
      {currentUser && (
        <>
          <Link to={`/teachers/${teacher.id}/edit`}>
            <button>Edit</button>
          </Link>
          <button onClick={() => {
            deleteTeacher(teacher.id);
            history.push('/')
          }}>Delete</button>
        </>
      )}
    </>
  )
}
