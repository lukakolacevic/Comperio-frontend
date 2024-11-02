import React, { useEffect, useState } from "react";
import { getTopSubjectsForStudent } from "../../api/SubjectApi";
import BarChart from "../../components/chart/BarChart.jsx";
import "./StudentProfilePage.css";

function StudentProfilePage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [topStudentSubjects, setTopStudentSubjects] = useState([]);
    //const [topStudentProfessors, setTopStudentProfessors] = useState([]);
    
    useEffect(() => {
        const fetchTopSubjects = async () => {
            try {
                const topSubjects = await getTopSubjectsForStudent(user.studentId);
                
                if (topSubjects && topSubjects.listOfMostChosenSubjects) {
                    setTopStudentSubjects(topSubjects.listOfMostChosenSubjects);
                    console.log(topStudentSubjects);
                } else {
                    console.error("Unexpected data format:", topSubjects);
                }
            } catch (error) {
                console.error("Error fetching top subjects:", error);
                setTopStudentSubjects([]);
            }
        };
        fetchTopSubjects();
        
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
                    <BarChart data={topStudentSubjects} />
                </div>
                <div className="chart-card">
                    <h3 className="chart-title">Tvoji najodabraniji profesori</h3>
                    
                </div>
            </div>
        </div>
    );
    
}

export default StudentProfilePage;
