import React, { useEffect, useState } from "react";
import { getTopSubjectsForStudent, getTopProfessorsForStudent } from "../../api/SubjectApi";
import BarChart from "../../components/chart/BarChart.jsx";
import "./StudentProfilePage.css";

function StudentProfilePage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [topStudentSubjects, setTopStudentSubjects] = useState([]);
    const [topStudentProfessors, setTopStudentProfessors] = useState([]);
    
    useEffect(() => {
        const fetchTopSubjectsAndProfessors = async () => {
            try {
                const topSubjects = await getTopSubjectsForStudent(user.id);
                const topProfessors = await getTopProfessorsForStudent(user.id);
                if (topSubjects && topSubjects.listOfMostChosenSubjects) {
                    setTopStudentSubjects(topSubjects.listOfMostChosenSubjects);
                    console.log(topStudentSubjects);
                } else {
                    console.error("Unexpected data format:", topSubjects);
                }

                if (topProfessors && topProfessors.listOfMostChosenInstructors) {
                    setTopStudentProfessors(topProfessors.listOfMostChosenInstructors);
                    console.log(topProfessors);
                } else {
                    console.error("Unexpected data format:", topProfessors);
                }
            } catch (error) {
                console.error("Error fetching top subjects:", error);
                setTopStudentSubjects([]);
            }
        };
        fetchTopSubjectsAndProfessors();
        
    }, [user.studentId]);

    return (
        <div className="profile-page-wrapper">
            <div className="profile-header">
                <img src="/placeholder.png" className="profile-image" alt="User" />
                <h2 className="profile-name">{user.name} {user.surname}</h2>
                <p className="profile-description">Profile Description Here.</p>
            </div>
    
            <div className="chart-wrapper"> {/* Wrapper for two charts */}
                <div className="chart-card">
                    <h3 className="chart-title">Tvoji najodabraniji predmeti</h3>
                    <BarChart data={topStudentSubjects} isForProfessors={false}/>
                </div>
                <div className="chart-card">
                    <h3 className="chart-title">Tvoji najodabraniji profesori</h3>
                    <BarChart data={topStudentProfessors} isForProfessors={true}/>
                </div>
            </div>
        </div>
    );
    
}

export default StudentProfilePage;
