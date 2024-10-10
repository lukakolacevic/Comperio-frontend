/* eslint-disable react/prop-types */
import * as React from "react";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Button, Dialog, DialogContent, DialogTitle, MenuItem, Select } from "@mui/material";
import { sentInstructionDate } from "../../api/ProfessorApi";
import { getSubjectsForProfessor } from "../../api/SubjectApi";

const DateTimeDialog = ({ open, onClose, professor, subjectId, isOnSubjectPage }) => {

  const formattedDate = dayjs().format('YYYY-MM-DDTHH:mm:ss');
  const [value, setValue] = React.useState(dayjs(formattedDate));
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjectId);
  const [availableSubjects, setAvailableSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!isOnSubjectPage) {
        try {
          const professorSubjects = await getSubjectsForProfessor(professor.professorId);
          console.log("Professor's subjects:", professorSubjects);
          setAvailableSubjects(professorSubjects.subjects); // Ensure it's an array
        } catch (error) {
          console.error("Error fetching subjects for professor:", error);
          setAvailableSubjects([]); // Set to an empty array if an error occurs
        }
      }
    };

    fetchSubjects(); // Only call this function once
  }, [isOnSubjectPage, professor.id]); // Dependencies
  const handleClose = () => {
    console.log("Dialog closed.")
    onClose();
  };

  const handleConfirm = () => {
    

    console.log("Selected date and time:", value.format('YYYY-MM-DDTHH:mm:ss'));
    console.log(professor)

    const isoDateString = value.toISOString();
    console.log("ISO Date String:", isoDateString);

    sentInstructionDate(isoDateString, professor.professorId, selectedSubjectId);
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Odaberi vrijeme instrukcija</DialogTitle>
      <DialogContent>
        <h3>
          Profesor: {professor.name} {professor.surname}
        </h3>
        {/* Only show subject dropdown if the user is not on the subject page */}
        {!isOnSubjectPage && (
          <div style={{ margin: "2rem 0" }}>
            <Select
              value={selectedSubjectId || ""}
              onChange={(event) => setSelectedSubjectId(event.target.value)}
              displayEmpty
              fullWidth
            >
              <MenuItem value="" disabled>
                Odaberi predmet
              </MenuItem>
              {availableSubjects.map((subject) => (
                <MenuItem key={subject.id} value={subject.id}>
                  {subject.title}
                </MenuItem>
              ))}
            </Select>
          </div>
        )}
        <div style={{ margin: "2rem 0" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Select date and time"
              value={value}
              onChange={(newValue) => setValue(dayjs(newValue))}
            />
          </LocalizationProvider>
        </div>
        <div>
          <Button variant="contained" onClick={handleConfirm}>
            Pošalji zahtjev za instrukcije
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            Odustani
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DateTimeDialog;
