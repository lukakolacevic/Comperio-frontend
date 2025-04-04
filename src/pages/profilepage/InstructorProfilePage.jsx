import React, { useEffect, useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import './InstructorProfilePage.css';
import { getSubjectsForInstructor, getSubjects } from '../../api/SubjectApi';
import ConfirmSelectionDialog from '../../components/dialog/ConfirmSelectionDialog';
import { Toast } from 'primereact/toast';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { removeInstructorFromSubject, joinSubject } from '../../api/InstructorApi';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
function InstructorProfilePage() {
    const [instructorSubjects, setInstructorSubjects] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]);
    const [filteredSubjects, setFilteredSubjects] = useState([]);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showConfirmJoinDialog, setShowConfirmJoinDialog] = useState(false);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [selectedSubjectTitle, setSelectedSubjectTitle] = useState('');
    const toast = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");
    const location = useLocation();

    let {user} = useAuth();
    useEffect(() => {

        if (user.id) {
            const fetchInstructorSubjects = async () => {
                try {
                    const fetchedInstructorSubjects = await getSubjectsForInstructor(user.id);
                    setInstructorSubjects(fetchedInstructorSubjects.subjects);
                } catch (error) {
                    console.error("Error fetching subjects.")
                    setInstructorSubjects([]);
                }
            }

            const fetchAllSubjects = async () => {
                try {
                    const fetchedSubjects = await getSubjects();
                    setAllSubjects(fetchedSubjects.subjects);
                    setFilteredSubjects(fetchedSubjects.subjects); // Initialize with all subjects
                } catch (error) {
                    console.error("Error fetching subjects.")
                    setAllSubjects([]);
                }
            }
            fetchAllSubjects();
            fetchInstructorSubjects();
        }
    }, [user.id, location]);

    useEffect(() => {
        const filtered = allSubjects.filter(subject =>
            subject.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredSubjects(filtered);
    }, [searchTerm, allSubjects]);

    const handleRemoveSubject = (subjectId) => {
        const selectedSubject = allSubjects.find(subject => subject.id === subjectId);
        setSelectedSubjectTitle(selectedSubject.title);
        setSelectedSubjectId(subjectId);
        setShowConfirmDialog(true);
    }

    const confirmRemoveSubject = async (instructorId) => {
        const subjectToRemove = instructorSubjects.find(subject => subject.id === selectedSubjectId);

        if (subjectToRemove) {
            const previousInstructorSubjects = [...instructorSubjects];
            setInstructorSubjects(prevSubjects =>
                prevSubjects.filter(subject => subject.id !== selectedSubjectId)
            );

            try {
                await removeInstructorFromSubject(instructorId, selectedSubjectId);
                setShowConfirmDialog(false);
                if (toast.current) {
                    toast.current.show({
                        severity: 'info',
                        summary: 'Predmet uspješno ispisan.',
                        life: 3000
                    });
                }
            } catch (error) {
                console.error(error.message);

                setInstructorSubjects(previousInstructorSubjects);
                setShowConfirmDialog(false);
                setSelectedSubjectId(null);
                setSelectedSubjectTitle('');

                if (toast.current) {
                    toast.current.show({
                        severity: 'warn',
                        summary: 'Dogodila se greška. Molim vas pokušajte ponovno.',
                        life: 3000
                    });
                }
            }
        }
    };

    const handleJoinSubject = (subjectId) => {
        const selectedSubject = allSubjects.find(subject => subject.id === subjectId);
        setSelectedSubjectTitle(selectedSubject.title);
        setSelectedSubjectId(subjectId);
        setShowConfirmJoinDialog(true);
    }

    const confirmJoinSubject = async (instructorId) => {
        const subjectToJoin = allSubjects.find(subject => subject.id === selectedSubjectId);
        console.log(instructorId, selectedSubjectId);
        if (subjectToJoin) {
            const previousInstructorSubjects = [...instructorSubjects];

            // Optimistically update the UI by adding the subject
            setInstructorSubjects(prevSubjects => [...prevSubjects, subjectToJoin]);

            try {
                await joinSubject(instructorId, selectedSubjectId);
                setShowConfirmJoinDialog(false);
                if (toast.current) {
                    toast.current.show({
                        severity: 'info',
                        summary: 'Predmet uspješno upisan.',
                        life: 3000
                    });
                }
            } catch (error) {
                console.error(error.message);

                if (error.message === "Already enrolled") {
                    if (toast.current) {
                        toast.current.show({
                            severity: 'warn',
                            summary: 'Već ste upisani na ovaj predmet.',
                            life: 3000
                        });
                    }
                }

                else {
                    if (toast.current) {
                        toast.current.show({
                            severity: 'warn',
                            summary: 'Dogodila se greška. Molim vas pokušajte ponovno.',
                            life: 3000
                        });
                    }
                }
                // Revert the UI back to the previous state on error
                setInstructorSubjects(previousInstructorSubjects);
                setShowConfirmJoinDialog(false);
                setSelectedSubjectId(null);
                setSelectedSubjectTitle('');
            }
        }
    };


    return (
        <div className="profile-page-wrapper">
            <Toast ref={toast} />

            <ConfirmSelectionDialog
                visible={showConfirmJoinDialog}
                message={`Jeste li sigurni da želite početi podučavati predmet ${selectedSubjectTitle}?`}
                header="Počni podučavati"
                icon="pi pi-check-circle"
                acceptClassName="p-button-success p-button-rounded"
                rejectClassName="p-button-secondary p-button-rounded"
                onConfirm={() => confirmJoinSubject(user.id)}
                onCancel={() => setShowConfirmJoinDialog(false)}

            />
            <ConfirmSelectionDialog
                visible={showConfirmDialog}
                message={`Jeste li sigurni da želite prestati podučavati predmet ${selectedSubjectTitle}? Svi zahtjevi i termini instrukcija za taj predmet bit će otkazani.`}
                header="Prestani podučavati"
                icon="pi pi-times-circle"
                acceptClassName="p-button-danger p-button-rounded"
                rejectClassName="p-button-secondary p-button-rounded"
                onConfirm={() => confirmRemoveSubject(user.id)}
                onCancel={() => setShowConfirmDialog(false)}

            />

            <div className="profile-header">
                <img src="/placeholder.png" className="profile-image" alt="User" />
                <h2 className="profile-name">{user.name} {user.surname}</h2>
                <p className="profile-description">Profile Description Here.</p>
            </div>

            <div className="content-wrapper">
                <div className="content-wrapper">
                    <div className="side-by-side">
                        {/* My Subjects Section */}
                        <Card title="Moji Predmeti" className="subject-card my-subjects">

                            <div className="scrollable-subject-list">
                                {instructorSubjects.length > 0 ? (
                                    instructorSubjects.map((subject) => (
                                        <div key={`instructor-${subject.id}`}>
                                            <div className="subject-item">
                                                <h4>{subject.title}</h4>
                                                <p>{subject.description || "No description available."}</p>
                                                <Button
                                                    label="Prestani podučavati"
                                                    className="p-button-danger"
                                                    rounded
                                                    onClick={() => handleRemoveSubject(subject.id, subject.title)}
                                                />
                                            </div>
                                            <hr className="subject-divider" />
                                        </div>
                                    ))
                                ) : (
                                    <div className="subject-placeholder">
                                        <p>Trenutno ne podučavate nijedan predmet.</p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Join a Subject Section */}
                        <Card title="Pridruži se predmetu" className="subject-card join-subject-card">
                            <InputText
                                placeholder="Pretraži predmete"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="subject-search"
                            />

                            <div className="scrollable-subject-list">
                                <Accordion multiple>
                                    {filteredSubjects.map((subject) => (
                                        <AccordionTab key={`filtered-${subject.id}`} header={<><h4>{subject.title}</h4></>}>
                                            <div className="subject-item-content">
                                                <p>{subject.description || "No description available."}</p>
                                                <Button
                                                    label="Pridruži se predmetu"
                                                    className="p-button-success"
                                                    rounded
                                                    onClick={() => handleJoinSubject(subject.id, subject.title)}
                                                />
                                            </div>
                                        </AccordionTab>
                                    ))}
                                </Accordion>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InstructorProfilePage;
