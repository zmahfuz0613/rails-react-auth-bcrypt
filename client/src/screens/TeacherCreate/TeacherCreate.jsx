import React, { useState } from 'react'

export default function TeacherCreate(props) {
  const [formData, setFormData] = useState({
    name: "",
    photo: ""
  })
  const { name, photo } = formData;
  const { newTeacher } = props;


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  return (
    <div className="create-form" >
      <h2>Create a New Teacher</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        newTeacher(formData);
        setFormData({
          name: "",
          photo: ""
        })
      }}>
        <label>
          Photo Link:
            <input
            type="text"
            name="photo"
            value={photo}
            onChange={handleChange}
          />
        </label>
        <label>
          Teacher's name:
            <input
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
          />
        </label>
        <button>Submit</button>
      </form>
    </div >
  )
}
