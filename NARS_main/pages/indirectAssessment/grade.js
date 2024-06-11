import React, { useEffect, useState } from "react";

const Creategrade = ({ cookies }) => {
  const [numCourses, setNumCourses] = useState(1);
  const [numQuizzes, setNumQuizzes] = useState(1);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);

  const handleNumCoursesChange = (e) => {
    setNumCourses(parseInt(e.target.value));
  };

  const handleNumQuizzesChange = (e) => {
    setNumQuizzes(parseInt(e.target.value));
  };

  const handleStudentChange = (e, index) => {
    const { value } = e.target;
    const updatedStudents = [...students];
    updatedStudents[index] = { ...updatedStudents[index], name: value };
    setStudents(updatedStudents);
  };

  const handleGradeChange = (e, studentIndex, gradeIndex) => {
    const { value } = e.target;
    const updatedGrades = [...grades];
    updatedGrades[studentIndex][gradeIndex] = value;
    setGrades(updatedGrades);
  };

  const renderCourseTable = () => {
    return (
      <div className="mx-auto" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <style>{`
          body {
            background-color: #012a4a;
            font-family: Arial, sans-serif;
          }
          th, td {
            text-align: center;
          }
          input[type="text"] {
            color: white;
            background-color: transparent;
            border: none;
            text-align: center;
            width: 100%;
            outline: none;
          }
          .table-container {
            max-width: 1200px; /* Adjust as needed */
          }
        `}</style>
        <div className="table-container">
          <table className="w-full border-collapse border border-blue-800">
            <thead>
              <tr className="bg-blue-200">
                <th className="border border-blue-800 py-2">
                  <input
                    type="text"
                    placeholder="Student"
                    onChange={(e) => handleStudentChange(e, 0)}
                  />
                </th>
                {[...Array(numCourses)].map((_, index) => (
                  <th key={index} className="border border-blue-800 py-2">
                    <input
                      type="text"
                      placeholder={`Course ${index + 1}`}
                      onChange={(e) => handleGradeChange(e, 0, index)}
                    />
                  </th>
                ))}
                <th className="border border-blue-800 py-2">
                  <input
                    type="text"
                    placeholder="Final Exam"
                    onChange={(e) => handleGradeChange(e, 0, numCourses)}
                  />
                </th>
                <th className="border border-blue-800 py-2">
                  <input
                    type="text"
                    placeholder="Midterm Exam"
                    onChange={(e) => handleGradeChange(e, 0, numCourses + 1)}
                  />
                </th>
                <th className="border border-blue-800 py-2">
                  <input
                    type="text"
                    placeholder="Final Project"
                    onChange={(e) => handleGradeChange(e, 0, numCourses + 2)}
                  />
                </th>
                {[...Array(numQuizzes)].map((_, index) => (
                  <th key={index} className="border border-blue-800 py-2">
                    <input
                      type="text"
                      placeholder={`Quiz ${index + 1}`}
                      onChange={(e) => handleGradeChange(e, 0, numCourses + 3 + index)}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student, studentIndex) => (
                <tr key={studentIndex} className={studentIndex % 2 === 0 ? "bg-blue-100" : "bg-blue-50"}>
                  <td className="border border-blue-800 px-4 py-2">
                    <input
                      type="text"
                      value={student.name}
                      onChange={(e) => handleStudentChange(e, studentIndex)}
                    />
                  </td>
                  {[...Array(numCourses)].map((_, courseIndex) => (
                    <td key={courseIndex} className="border border-blue-800 px-4 py-2">
                      {/* Input fields for course grades */}
                    </td>
                  ))}
                  <td className="border border-blue-800 px-4 py-2">
                    <input
                      type="text"
                      value={grades[studentIndex][0] || ""}
                      onChange={(e) => handleGradeChange(e, studentIndex, 0)}
                    />
                  </td>
                  <td className="border border-blue-800 px-4 py-2">
                    <input
                      type="text"
                      value={grades[studentIndex][1] || ""}
                      onChange={(e) => handleGradeChange(e, studentIndex, 1)}
                    />
                  </td>
                  <td className="border border-blue-800 px-4 py-2">
                    <input
                      type="text"
                      value={grades[studentIndex][2] || ""}
                      onChange={(e) => handleGradeChange(e, studentIndex, 2)}
                    />
                  </td>
                  {[...Array(numQuizzes)].map((_, quizIndex) => (
                    <td key={quizIndex} className="border border-blue-800 px-4 py-2">
                      <input
                        type="text"
                        value={grades[studentIndex][numCourses + 3 + quizIndex] || ""}
                        onChange={(e) => handleGradeChange(e, studentIndex, numCourses + 3 + quizIndex)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={addStudent}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          >
            Add Student
          </button>
        </div>
      </div>
    );
  };

  const addStudent = () => {
    setStudents((prevStudents) => [...prevStudents, { name: "" }]);
    setGrades((prevGrades) => [
      ...prevGrades,
      Array.from({ length: numCourses + numQuizzes + 3 }, () => ""),
    ]);
  };

  const submitGrades = () => {
    // Logic to submit grades to backend
  };

  return (
    <div className="flex justify-center min-h-scree ">
      <div className="bg-form p-12 max-w-3xl w-full shadow-2xl rounded-3xl mt-10 text-form bg-white">
        <h2 className="font-bold text-blue-900 mb-4 text-3xl">Enter Student Grades</h2>
        <div className="flex flex-col gap-4">
          <label htmlFor="numQuizzes" className="text-form font-bold mb-3">
            Number of Quizzes:
          </label>
          <select
            id="numQuizzes"
            value={numQuizzes}
            onChange={handleNumQuizzesChange}
            className="input-field mb-4 bg-blue-400"
            required
          >
            {[...Array(6)].map((_, index) => (
              <option key={index} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </div>

        {renderCourseTable()}

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={submitGrades}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ml-4"
          >
            Submit Grades
          </button>
        </div>
      </div>
    </div>
  );
};

export default Creategrade;
