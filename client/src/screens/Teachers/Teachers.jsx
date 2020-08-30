import React from 'react';
import { useHistory } from 'react-router-dom';

export default function Teachers(props) {
  const { teachers, currentUser } = props;
  const history = useHistory();

  return (
    <div className="teacher-container">
      {teachers.map(teacher => (
        <div
          key={teacher.id}
          className="teacher-card"
          onClick={(e) => {
            history.push(`/${teacher.id}`);
            window.scrollTo(0, 0);
          }}>
          <img
            alt={teacher.name}
            src={teacher.photo}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://www.eguardtech.com/wp-content/uploads/2018/08/Network-Profile.png'
            }}
          />
          <h3>
            <p>{teacher.name}</p>
          </h3>
        </div>
      ))}
      {currentUser && (
        <div
          className="teacher-card"
          onClick={() => {
            history.push('/new');
            window.scrollTo(0, 0);
          }}>
          <img
            alt="Create a new teacher"
            src="https://image.flaticon.com/icons/png/512/14/14980.png"
            className="plus-sign"
          />
          <h3>Create a new teacher</h3>
        </div>
      )}
    </div>
  )
}
