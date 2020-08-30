import React from 'react';
import { Link, useHistory } from 'react-router-dom';

export default function TeacherInfo(props) {
  const { teacher, deleteTeacher, currentUser } = props;
  const history = useHistory();

  return (
    <>
      <h1>{teacher.name}</h1>
      {currentUser && (
        <>
          <Link to={`/${teacher.id}/edit`}>
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
