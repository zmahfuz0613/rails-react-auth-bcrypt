import React, { useState, useEffect } from 'react';
import { Switch, Route, useParams } from 'react-router-dom';

import TeacherInfo from '../../components/TeacherInfo/TeacherInfo'
import EditTeacher from '../../components/EditTeacher/EditTeacher'

export default function TeacherDetail(props) {
  const [teacher, setTeacher] = useState(null);
  const { id } = useParams();
  const { teachers, deleteTeacher, editTeacher, currentUser } = props;

  useEffect(() => {
    if (teachers.length) {
      const teacher = teachers.find(teacher => teacher.id === Number(id));
      setTeacher(teacher)
    }
  }, [teachers, id])

  return (
    <div className="teacher-page">
      {
        teacher ? (
          <div>
            <img
              alt={teacher.name}
              src={teacher.photo}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://www.eguardtech.com/wp-content/uploads/2018/08/Network-Profile.png'
              }}
            />
            <Switch>
              <Route path='/:id/edit'>
                <EditTeacher
                  editTeacher={editTeacher}
                  teacher={teacher}
                  id={id}
                />
              </Route>
              <Route path='/:id'>
                <TeacherInfo
                  teacher={teacher}
                  deleteTeacher={deleteTeacher}
                  currentUser={currentUser}
                />
              </Route>
            </Switch>
          </div>
        ) : <h2>Loading . . .</h2>
      }
    </div>
  )
}
