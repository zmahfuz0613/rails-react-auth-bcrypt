import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

export default function EditTeacher(props) {
  const [formData, setFormData] = useState({
    name: "",
    photo: ""
  })
  const { name, photo } = formData;
  const { editTeacher } = props;
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    const prefillFormData = () => {
      const { name, photo } = props.teacher;
      setFormData({ name, photo });
    }
    prefillFormData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  return (
    <div>
      <h3>Update Teacher</h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        editTeacher(id, formData);
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
    </div>
  )
}
