import React from 'react';
import { withRouter } from 'react-router-dom';

function CreateTeacher(props) {
  return (
    <div className="create-form" >
      <h2>Create a new teacher</h2>
      <form onSubmit={props.newTeacher}>
        <p>Photo Link:</p>
        <input
          type="text"
          name="photo"
          value={props.teacherForm.photo}
          onChange={props.handleFormChange} />
          <p>Teacher's name:</p>
        <input
          type="text"
          name="name"
          value={props.teacherForm.name}
          onChange={props.handleFormChange} />
        <button>Submit</button>
      </form>
    </div >
  )
}

export default withRouter(CreateTeacher);
