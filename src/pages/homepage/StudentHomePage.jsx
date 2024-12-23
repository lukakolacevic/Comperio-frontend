import "./HomePage.css";

import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';

import InputAdornment from "@mui/material/InputAdornment";
import InstructorsComponent from "../../components/instructors/InstructorsComponent";
import { getSubjects } from '../../api/SubjectApi';
import { getInstructors } from '../../api/InstructorApi';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


function ComboBox() {
  const [subjects, setSubjects] = useState([]);

  console.log(localStorage.getItem("user"))

  useEffect(() => {
    getSubjects().then(response => setSubjects(response.subjects));
  }, []);

  const handleSubjectSelect = (event, value) => {
    if (value) {
      window.location.href = `/subject/${value.url}`;
    }
  };

  return (
    <>
    <div className="search-container">
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={subjects}
      getOptionLabel={(option) => option.title}
      onChange={handleSubjectSelect}
      renderInput={(params) =>
        <TextField {...params} 
        InputProps={{
          ...params.InputProps,
          startAdornment: (
            <InputAdornment position="start">
              <img
                src="/icons/search-icon.svg"
                style={{ height: "20px", width: "20px" }}
              />
            </InputAdornment>
          ),
        }}
        />
      }
    />
    {/* <Button variant="contained" onClick={handleButtonClick}>Pretraži</Button> */}
    </div>
    <div>
      {subjects.map((subject) => (
        <Link
          to={`/subject/${subject.url}`}
          key={subject.url}
          className="link-no-style"
        >
          <div className="predmet">
            <h2 className="predmet-text">{subject.title}</h2>
            <p className="predmet-text">{subject.description}</p>
          </div>
        </Link>
      ))}
    </div>
    </>
  );
}

function StudentHomePage() {
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    const fetchInstructors = async () => {
      const fetchedInstructors = await getInstructors();
      console.log("Prvi return: ", fetchedInstructors); // Check what is actually being returned here
      setInstructors(fetchedInstructors.instructors);
      console.log("Drugi return: ", instructors); // This will show the previous state due to closure
    };

    fetchInstructors();
  }, []);

  

  return (
    <>
      <div className="homepage-wrapper">
        <div className="homepage-container">
          <div>
            <div className="title">
              
              <h2>Instrukcije po mjeri!</h2>
            </div>

              <ComboBox />

          </div>

          <div>
            <h4>Najpopularniji instruktori:</h4>
            <InstructorsComponent
              instructors={instructors}
              sessions = {null}
              showSubject={true}
              showInstructionsCount={true}
              isOnProfilePage={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentHomePage;
