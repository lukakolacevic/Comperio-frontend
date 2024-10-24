import React, { useEffect, useState, useRef, useOptimistic } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Chips } from 'primereact/chips';
import { InputTextarea } from 'primereact/inputtextarea';
import './ProfilePage.css'; // For custom styles
import { getSubjectsForProfessor } from '../../api/SubjectApi';
import { getTabScrollButtonUtilityClass } from '@mui/material';
import ConfirmSelectionDialog from '../../components/dialog/ConfirmSelectionDialog';
import { Toast } from 'primereact/toast';
import { removeProfessorFromSubject } from '../../api/ProfessorApi';

function ProfilePage() {

    const [professorSubjects, setProfessorSubjects] = useState([]);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    //const [optimisticProfessorSubjects, setOptimisticProfessorSubjects] = useOptimistic(professorSubjects);
    const toast = useRef(null);

    let user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (user.professorId) {
            const fetchProfessorSubjects = async () => {
                try {
                    const fetchedProfessorSubjects = await getSubjectsForProfessor(user.professorId);
                    setProfessorSubjects(fetchedProfessorSubjects.subjects);
                } catch (error) {
                    console.error("Error fetching subjects.")
                    setProfessorSubjects([]);
                }
            }
            fetchProfessorSubjects();
            console.log("DDd")
        }
    }, [user.professorId]);

    const handleRemove = (subjectId) => {
        setSelectedSubjectId(subjectId);
        setShowConfirmDialog(true);
    }

    const confirmRemove = async (professorId) => {
        const subjectToRemove = professorSubjects.find(subject => subject.id === selectedSubjectId);

        if (subjectToRemove) {
            // Copy the current state before making any changes (for rollback purposes)
            const previousProfessorSubjects = [...professorSubjects];

            // Optimistically update the state (remove subject)
            setProfessorSubjects(prevSubjects =>
                prevSubjects.filter(subject => subject.id !== selectedSubjectId)
            );

            try {
                // Attempt to remove the subject from the backend
                await removeProfessorFromSubject(professorId, null);

                // Close dialog and show success message
                setShowConfirmDialog(false);
                if (toast.current) {
                    toast.current.show({
                        severity: 'info',
                        summary: 'Predmet uspješno ispisan.',
                        life: 3000
                    });
                }
            } catch (error) {
                console.error("Error: " + error);

                setProfessorSubjects(previousProfessorSubjects);

                setShowConfirmDialog(false);

                setSelectedSubjectId(null);

                // Show error message
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


    return (
        <div className="profile-page-wrapper">

            <Toast ref={toast} />

            <ConfirmSelectionDialog
                visible={showConfirmDialog}
                message="Jeste li sigurni da želite prestati podučavati odabrani predmet? Svi termini instrukcija i zahtjevi za termin za odabrani predmet biti će otkazani."
                header="Prihvati zahtjev"
                icon="pi pi-exclamation-triangle"
                acceptClassName="p-button-primary"
                rejectClassName="p-button-secondary"
                onConfirm={() => confirmRemove(user.professorId)}
                onCancel={() => setShowConfirmDialog(false)}
            />

            <div className="profile-header">
                <img src="/placeholder.png" className="profile-image" alt="User" />
                <h2 className="profile-name">{user.name} {user.surname}</h2>
                <p className="profile-description">Obriši ovo.</p>
            </div>

            <div className="content-wrapper">
                <div className="side-by-side">
                    {/* Moji predmeti Section */}
                    <Card title="Moji predmeti" className="subject-card">
                        {professorSubjects.length > 0 ? (
                            professorSubjects.map((subject) => (
                                <React.Fragment key={subject.id}>
                                    <div className="subject-item">
                                        <h4>{subject.title}</h4>
                                        <p>{subject.description || "No description available."}</p>
                                        <Button label="Prestani podučavati" className="p-button-danger" rounded onClick={() => handleRemove(subject.id)} />
                                    </div>
                                    <hr className="subject-divider" />
                                </React.Fragment>
                            ))
                        ) : (
                            <div className="subject-placeholder">
                                <p className="">Trenutno niste upisani ni u jedan predmet.</p>
                            </div>

                        )}
                    </Card>

                    {/* Pridruži se predmetu Section */}
                    <Card title="Pridruži se predmetu" className="subject-card">
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-search"></i>
                            </span>
                            <InputText placeholder="Pretraži po lorem ipsum" />
                            <Button label="Pretraži" />
                        </div>

                        <div className="subject-item">
                            <h4>Title</h4>
                            <p>Lorem ipsum dolor sit amet consectetur. Eu fermentum posuere porttitor dui erat amet.</p>
                            <Button label="Odaberi" />
                        </div>
                        <hr className="subject-divider" />
                        <div className="subject-item">
                            <h4>Title</h4>
                            <p>Lorem ipsum dolor sit amet consectetur. Eu fermentum posuere porttitor dui erat amet.</p>
                            <Button label="Odaberi" />
                        </div>
                    </Card>
                </div>

                {/* Stvori novi predmet Section */}
                <Card title="Stvori novi predmet" className="create-subject-card">
                    <InputText placeholder="Upišite naziv predmeta" className="create-subject-input" />
                    <Chips placeholder="Odaberite kategorije koje opisuju predmet" />
                    <InputTextarea rows={5} placeholder="Upišite kratki opis predmeta" />

                    <div className="button-group">
                        <Button label="Stvori predmet" className="p-button-success" />
                        <Button label="Odbaci" className="p-button-secondary" />
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default ProfilePage;
