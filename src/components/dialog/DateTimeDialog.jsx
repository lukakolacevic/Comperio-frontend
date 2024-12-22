/* eslint-disable react/prop-types */
import * as React from "react";
import { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Button, Dialog, DialogContent, DialogTitle, MenuItem, Select, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { sentInstructionDate } from "../../api/InstructorApi";
import { getSubjectsForInstructor } from "../../api/SubjectApi";
import { Toast } from "primereact/toast"; // Import PrimeReact Toast

const DateTimeDialog = ({ open, onClose, instructor, subjectId, isOnSubjectPage, onSuccess }) => {
  const formattedDate = dayjs().format("YYYY-MM-DDTHH:mm:ss");
  const [value, setValue] = React.useState(dayjs(formattedDate));
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjectId);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState(60); // Default duration in minutes (1 hour)
  const errorToast = useRef(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!isOnSubjectPage) {
        try {
          const instructorSubjects = await getSubjectsForInstructor(instructor.id);
          setAvailableSubjects(instructorSubjects.subjects || []); // Ensure it's an array
        } catch (error) {
          setAvailableSubjects([]); // Set to an empty array if an error occurs
        }
      }
    };

    fetchSubjects(); // Only call this function once
  }, [isOnSubjectPage, instructor.id]); // Adjusted the dependency to `instructor.id`

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = async () => {
    try {
      const isoDateString = value.toISOString();
      await sentInstructionDate(isoDateString, selectedDuration, instructor.id, selectedSubjectId);

      // Success - Close dialog and trigger success toast outside the component
      handleClose();
      onSuccess(); // Trigger the success toast in the parent component
    } catch (error) {
      let errorMessage = "Dogodila se greška. Molim vas pokušajte ponovno."; // Default error message
      const toastSeverity = error?.code === "INVALID_CREDENTIALS" ? "warn" : "error";

      if (errorToast.current) {
        errorToast.current.show({
          severity: toastSeverity,
          summary: errorMessage,
          life: 5000,
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
            Profesor: {instructor.name} {instructor.surname}
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

          {/* Date and Time Picker */}
          <div style={{ margin: "2rem 0" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Odaberi datum i vrijeme"
                value={value}
                onChange={(newValue) => setValue(dayjs(newValue))}
              />
            </LocalizationProvider>
          </div>

          {/* Duration Selection */}
          <div style={{ margin: "2rem 0" }}>
            <FormControl>
              <FormLabel>Trajanje termina:</FormLabel>
              <RadioGroup
                value={selectedDuration}
                onChange={(event) => setSelectedDuration(Number(event.target.value))}
              >
                <FormControlLabel value={45} control={<Radio />} label="45 minuta" />
                <FormControlLabel value={60} control={<Radio />} label="60 minuta" />
                <FormControlLabel value={90} control={<Radio />} label="90 minuta" />
                <FormControlLabel value={120} control={<Radio />} label="120 minuta" />
                <FormControlLabel value={180} control={<Radio />} label="180 minuta" />
              </RadioGroup>
            </FormControl>
          </div>

          {/* Buttons */}
          <div>
            <Button variant="contained" onClick={handleConfirm} style={{ marginRight: "1rem" }}>
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
