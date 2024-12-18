import "./SubjectPage.css";
import InstructorsComponent from "../../components/instructors/InstructorsComponent";
import { getSubject } from "../../api/SubjectApi";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function SubjectPage() {
  if (!localStorage.getItem('token')) {
    window.location.href = '/login';
  }

  let { subjectName } = useParams();
  const [subjectData, setSubjectData] = useState(null);
  

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSubject(subjectName);
      console.log(data)
      setSubjectData(data);
    };

    fetchData();
  }, [subjectName]);

  return (
    <>
      <div className="subjectPage-wrapper">
        <div className="subjectPage-container">
          <div>
            <div className="subjectPage-title">
              <h1>{subjectData ? subjectData.subject.title : "Ime predmeta"}</h1>
              <p>
                {subjectData ? subjectData.subject.description : "Opis predmeta"}
              </p>
            </div>
          </div>

          <div>
            <h4>Najpopularniji instruktori:</h4>
            <InstructorsComponent
              instructors={subjectData ? subjectData.instructors : []}
              sessions = {null}
              showSubject={false}
              showInstructionsCount={false}
              isOnProfilePage={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default SubjectPage;
