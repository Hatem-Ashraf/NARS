import React, { useState, useEffect } from "react";

const Creategrade = () => {
  const [studentmarks, setStudentmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await fetch("http://localhost:8087/student");
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const res = await response.json();
      setStudentmarks(res.data.students);
    } catch (error) {
      console.error("Error fetching grades:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderCourseTable = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

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
          <table className="border-collapse border border-blue-800">
            <thead>
              <tr>
                <th className="border border-blue-800 py-2">Student Name</th>
                <th className="border border-blue-800 py-2">Student ID</th>
                <th className="border border-blue-800 py-2">Department</th>
                <th className="border border-blue-800 py-2">Program</th>
                <th className="border border-blue-800 py-2">Quiz</th>
                <th className="border border-blue-800 py-2">Midterm Exam</th>
              </tr>
            </thead>
            <tbody>
              {studentmarks.length > 0 ? (
                studentmarks.map((student, studentIndex) => (
                  <React.Fragment key={student._id || studentIndex}>
                    <tr>
                      <td className="border border-blue-800 py-2">{student.name}</td>
                      <td className="border border-blue-800 py-2">{student._id}</td>
                      <td className="border border-blue-800 py-2">{student.department}</td>
                      <td className="border border-blue-800 py-2">{student.program}</td>
                      {student.assessmentMethods.map((method, methodIndex) => (
                        <td key={method.assessment} className="border border-blue-800 py-2">
                          {method.grade || 'N/A'}
                        </td>
                      ))}
                    </tr>
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="border border-blue-800 py-2">No students found.</td>
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
