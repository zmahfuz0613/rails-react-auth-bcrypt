import React from 'react';
import { withRouter } from 'react-router';

function TeachersView(props) {
  return (
    <div className="teacher-container">
      {props.teachers.map(teacher => (
        <div
          key={teacher.id}
          className="teacher-card"
          onClick={(e) => {
            props.history.push(`/teachers/${teacher.id}`);
            window.scrollTo(0, 0);
          }}>
          <img alt={teacher.name} src={teacher.photo} />
          <h3>
            <p>{teacher.name}</p>
          </h3>
        </div>
      ))}
      <div
        className="teacher-card"
        onClick={() => {
          props.history.push('/new/teacher');
          window.scrollTo(0, 0);
        }}>
        <img
          alt="Create a new teacher"
          src="https://image.flaticon.com/icons/png/512/14/14980.png"
          className="plus-sign" />
        <h3>Create a new teacher</h3>
      </div>
    </div>
  )
}

export default withRouter(TeachersView)