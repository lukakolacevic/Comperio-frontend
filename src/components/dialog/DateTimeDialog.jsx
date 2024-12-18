/* eslint-disable react/prop-types */
import * as React from "react";
import { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Button, Dialog, DialogContent, DialogTitle, MenuItem, Select } from "@mui/material";
import { sentInstructionDate } from "../../api/ProfessorApi";
import { getSubjectsForProfessor } from "../../api/SubjectApi";
import { Toast } from 'primereact/toast'; // Import PrimeReact Toast

const DateTimeDialog = ({ open, onClose, professor, subjectId, isOnSubjectPage, onSuccess }) => {

  const formattedDate = dayjs().format('YYYY-MM-DDTHH:mm:ss');
  const [value, setValue] = React.useState(dayjs(formattedDate));
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjectId);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const errorToast = useRef(null);   // Toast for errors
  let toastSeverity = "";

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!isOnSubjectPage) {
        try {
          const professorSubjects = await getSubjectsForProfessor(professor.id);
          setAvailableSubjects(professorSubjects.subjects); // Ensure it's an array
        } catch (error) {
          setAvailableSubjects([]); // Set to an empty array if an error occurs
        }
      }
    };

    fetchSubjects(); // Only call this function once
  }, [isOnSubjectPage, professor.id]); // Adjusted the dependency to `professor.id`

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = async () => {
    try {
      const isoDateString = value.toISOString();
      await sentInstructionDate(isoDateString, professor.id, selectedSubjectId);

      // Success - Close dialog and trigger success toast outside the component
      handleClose();
      onSuccess(); // Trigger the success toast in the parent component
    } catch (error) {
      let errorMessage = "Dogodila se greška. Molim vas pokušajte ponovno.";  // Default error message
      toastSeverity = 'error';

      if (error?.code === "MAX_SESSIONS_EXCEEDED") {
        errorMessage = "Možete poslati najviše 5 zahtjeva za instrukcije.";
      } else if (error?.code === "INVALID_CREDENTIALS") {
        errorMessage = "Odaberite predmet prije slanja zahtjeva.";
        toastSeverity = 'warn';
      }

      // Error - Show the error message without closing the dialog
      if (errorToast.current) {
        errorToast.current.show({
          severity: toastSeverity,
          summary: errorMessage,
          life: 5000
        });
      }
    }
  };

  return (
    <>
      {/* Dialog for date and subject selection */}
      <Dialog open={open} onClose={handleClose} style={{ zIndex: 1000 }}>
        {/* Toast for error messages */}
        <Toast ref={errorToast} position="top-center" style={{ zIndex: 5000 }} />

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
    </>
  );
};

export default DateTimeDialog;
