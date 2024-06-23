import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


const Creategrade = () => {
  const userState = useSelector((s) => s.user);

  const [studentmarks, setStudentmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [courseId, setCourseId] = useState(null);
  const [assessments, setAssessments] = useState([]); // State to store the assessment names

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await fetch("http://localhost:8087/student", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userState.token,
        },
      });

      const res = await response.json();
      console.log("STUDENTS:: ", res)
      setStudentmarks(res.data.students);
      setCourseId(res.data.courseId);

      // Extract assessment names from the first student's assessmentMethods
      if (res.data.students.length > 0) {
        const firstStudent = res.data.students[0];
        const assessmentNames = firstStudent.assessmentMethods.map(method => method.assessment);
        setAssessments(assessmentNames);
      }
    } catch (error) {
      console.error("Error fetching grades:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateGrades = async () => {
    setUpdateLoading(true);
    setUpdateError(null);

    try {
      const gradesData = assessments.map(assessment => ({
        assessment,
        grades: studentmarks.map((student) => ({
          studentId: student._id,
          courseId,
          grade: student.assessmentMethods.find(
            (method) => method.assessment === assessment
          ).grade,
        })),
      }));

      const response = await fetch("http://localhost:8087/studentGrade", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userState.token,
        },
        body: JSON.stringify({ assessments: gradesData }),
      });
      const res = await response.json();


      // if (response.ok) {
      //   console.log("Grades updated successfully");
      // } else {
        // const errorData = await response.json();
      //   throw new Error(errorData.message || "Failed to update grades");
      // }

    } catch (error) {
      console.error("Error updating grades:", error);
      setUpdateError(error.message || "Failed to update grades");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleInputChange = (e, studentIndex, methodIndex) => {
    const { name, value } = e.target;
    const updatedStudentMarks = [...studentmarks];
    updatedStudentMarks[studentIndex].assessmentMethods[
      methodIndex
    ][name] = value;
    setStudentmarks(updatedStudentMarks);
    setHasChanges(true);
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
  };

  const handleSaveClick = async () => {
    if (editingIndex !== null) {
      await updateGrades();
      setEditingIndex(null);
      setHasChanges(false);
    }
  };

  const renderCourseTable = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    const handleSaveOrEditClick = async (studentIndex) => {
      if (editingIndex === studentIndex) {
        await handleSaveClick();
      } else {
        handleEditClick(studentIndex);
      }
    };

    return (
      <div className="mx-auto" style={{ maxHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <style>{`
          body {
            font-family: Arial, sans-serif;
          }
          th, td {
            text-align: center;
            padding: 8px;
          }
          .table-container {
            max-width: 1200px;
            width: 100%;
            margin: 0 auto;
          }
          .editable-cell {
            color: blue;
            border: 1px solid #ccc;
            text-align: center;
            width: 100%;
            outline: none;
            padding: 8px;
            box-sizing: border-box;
          }
        `}</style>
        <div className="table-container">
          <table className="border-collapse border border-blue-800 w-100">
            <thead>
              <tr>
                <th className="border border-blue-800 py-2">Student Name</th>
                {assessments.map(assessment => (
                  <th key={assessment} className="border border-blue-800 py-2">{assessment}</th>
                ))}
                <th className="border border-blue-800 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {studentmarks.length > 0 ? (
                studentmarks.map((student, studentIndex) => (
                  <React.Fragment key={student._id || studentIndex}>
                    <tr>
                      <td className="border border-blue-800 py-2">{student.name}</td>
                      {student.assessmentMethods.map((method, methodIndex) => (
                        <td key={method.assessment} className="border border-blue-800 py-2">
                          {editingIndex === studentIndex ? (
                            <input
                              type="text"
                              name="grade"
                              value={method.grade}
                              onChange={(e) => handleInputChange(e, studentIndex, methodIndex)}
                              className="editable-cell"
                            />
                          ) : (
                            method.grade || 'N/A'
                          )}
                        </td>
                      ))}
                      <td className="border border-blue-800 py-2">
                        <button
                          onClick={() => handleSaveOrEditClick(studentIndex)}
                          className={`px-2 py-1 text-white rounded-md hover:bg-${editingIndex === studentIndex ? 'green' : 'blue'}-700 bg-${editingIndex === studentIndex ? 'green' : 'blue'}-600 transition duration-300`}
                        >
                          {editingIndex === studentIndex ? 'Save' : 'Edit'}
                        </button>
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={assessments.length + 2} className="border border-blue-800 py-2">No students found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-center min-h-screen text-black">
      <div className="bg-form p-12 shadow-2xl rounded-3xl mt-10 text-form bg-white w-4/5">
        <h2 className="font-bold text-blue-900 mb-6 text-3xl text-center">Enter Student Grades</h2>
        <div className="flex flex-col gap-4">
          {renderCourseTable()}
        </div>
      </div>
    </div>
  );
};

export default Creategrade;
