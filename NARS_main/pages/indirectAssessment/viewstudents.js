import React, { useState, useEffect } from "react";
import { FaTrashAlt, FaEdit, FaSave } from 'react-icons/fa';

const CreateGrade = ({ cookies }) => {
  const [studentmarks, setStudentmarks] = useState([]);
  const [departments, setDepartments] = useState({});
  const [programs, setPrograms] = useState({});
  const [courseNames, setCourseNames] = useState({});
  const [programNames, setProgramNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingStudentId, setEditingStudentId] = useState(null);

  useEffect(() => {
    fetchAllData()
  }, []);

  const fetchAllData = async () => {
    await fetchGrades();
    await fetchDepartments();
    await fetchPrograms();
    setLoading(false);
  };

  const fetchGrades = async () => {
    try {
      const response = await fetch("http://localhost:8087/student")
        
      
      
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const res = await response.json();
      const students = res.data.students;
      setStudentmarks(students);
      
      const courseIds = [];
      const programDetails = [];

      students.forEach(student => {
        student.courses.forEach(courseId => courseIds.push(courseId));
        programDetails.push({ facultyId: student.faculty, departmentId: student.department, programId: student.program });
      });
      console.log(courseIds)

      await fetchCourseNames(Array.from(courseIds));
      // await fetchProgramNames(programDetails);
    } catch (error) {
      console.error("Error fetching grades:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch("http://localhost:8084", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      const data = await response.json();
      if (data.status === "success" && Array.isArray(data.data)) {
        const deptMap = data.data.reduce((acc, department) => {
          acc[department._id] = department.name;
          return acc;
        }, {});
        setDepartments(deptMap);
      } else {
        console.error("Unexpected data format:", data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await fetch("http://localhost:8086", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      const data = await response.json();
      if (data.status === "success" && Array.isArray(data.data)) {
        const progMap = data.data.reduce((acc, program) => {
          acc[program._id] = program.name;
          return acc;
        }, {});
        setPrograms(progMap);
      } else {
        console.error("Unexpected data format:", data);
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  const fetchCourseNames = async (courseIds) => {
    console.log(courseIds)
    
    try {
      const fetchedCourseNames = {};
      for (const courseId of courseIds) {

        const response = await fetch(`http://localhost:8087/newCourse/${courseId}`, {
          method: "GET",
         
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userRole")}`,
          },
        });
        console.log(response)
        const data = await response.json();
          console.log(data)
       
        if (response.ok) {
          
          
          
          if (data.status === "success") {
            fetchedCourseNames[courseId] = data.data.name;
          }
        } else {
          console.error(`Error fetching course ${courseId}`);
        }
      }
      
      setCourseNames(fetchedCourseNames);
    } catch (error) {
      console.error("Error fetching course names:", error);
    }
  };

  const fetchProgramNames = async (programDetails) => {
    try {
      const fetchedProgramNames = {};
      for (const { facultyId, departmentId, programId } of programDetails) {
        const response = await fetch(`http://localhost:8086/${facultyId}/department/${departmentId}/program/${programId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.status === "success") {
            fetchedProgramNames[programId] = data.data.name;
          }
        } else {
          console.error(`Error fetching program ${programId}`);
        }
      }
      setProgramNames(fetchedProgramNames);
    } catch (error) {
      console.error("Error fetching program names:", error);
    }
  };

  const handleDelete = async (studentId) => {
    try {
      const response = await fetch(`http://localhost:8087/student/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookies.token}`,
        },
      });
      if (response.ok) {
        setStudentmarks(prevStudents => prevStudents.filter(student => student._id !== studentId));
      } else {
        console.error("Failed to delete student");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleEdit = (studentId) => {
    setEditingStudentId(studentId);
  };

  const handleSave = async (studentId) => {
    try {
      const studentToUpdate = studentmarks.find(student => student._id === studentId);
      const { name, _id, program, department, courses } = studentToUpdate;

      const response = await fetch(`http://localhost:8087/student/${studentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookies.token}`,
        },
        body: JSON.stringify({ name, _id, program, department, courses }),
      });

      if (response.ok) {
        setEditingStudentId(null);
      } else {
        console.error("Failed to update student");
      }
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  return (
    <div className="flex justify-center min-h-screen text-black">
      <div className="bg-form p-12 shadow-2xl rounded-3xl mt-10 text-form bg-white w-4/5">
        <h2 className="font-bold text-blue-900 mb-6 text-3xl text-center">View Students</h2>
        <div className="flex flex-col gap-4">
          {loading ? (
            <div>Loading...</div>
          ) : (
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
                }
              `}</style>
              <div className="table-container">
                <table className="border-collapse border border-blue-800">
                  <thead>
                    <tr>
                      <th className="border border-blue-800 py-2">Student Name</th>
                      <th className="border border-blue-800 py-2">Student ID</th>
                      <th className="border border-blue-800 py-2">Department</th>
                      
                      <th className="border border-blue-800 py-2">Course Name</th>
                      <th className="border border-blue-800 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentmarks.length > 0 ? (
                      studentmarks.map((student, studentIndex) => (
                        <React.Fragment key={student._id || studentIndex}>
                          <tr>
                            <td className="border border-blue-800 py-2">
                              {editingStudentId === student._id ? (
                                <input
                                  type="text"
                                  className="editable-cell"
                                  value={student.name}
                                  onChange={(e) => {
                                    const updatedName = e.target.value;
                                    setStudentmarks(prevStudents =>
                                      prevStudents.map(s =>
                                        s._id === student._id ? { ...s, name: updatedName } : s
                                      )
                                    );
                                  }}
                                />
                              ) : student.name}
                            </td>
                            <td className="border border-blue-800 py-2">
                              {student._id}
                            </td>
                            <td className="border border-blue-800 py-2">
                              {editingStudentId === student._id ? (
                                <input
                                  type="text"
                                  className="editable-cell"
                                  value={student.department}
                                  onChange={(e) => {
                                    const updatedDepartment = e.target.value;
                                    setStudentmarks(prevStudents =>
                                      prevStudents.map(s =>
                                        s._id === student._id ? { ...s, department: updatedDepartment } : s
                                      )
                                    );
                                  }}
                                />
                              ) : departments[student.department]}
                            </td>
                          
                            <td className="border border-blue-800 py-2">
                              {editingStudentId === student._id ? (
                                <select
                                  className="editable-cell"
                                  value={student.courses}
                                  onChange={(e) => {
                                    const updatedCourses = Array.from(e.target.selectedOptions, option => option.value);
                                    setStudentmarks(prevStudents =>
                                      prevStudents.map(s =>
                                        s._id === student._id ? { ...s, courses: updatedCourses } : s
                                      )
                                    );
                                  }}
                                  multiple
                                >
                                  {Object.entries(courseNames).map(([id, name]) => (
                                    <option key={id} value={id}>{name}</option>
                                  ))}
                                </select>
                              ) : (
                                <>{student.courses && student.courses.map((courseId, index) => (
                                  <span key={index}>{courseNames[courseId] || courseId}<br /></span>
                                ))}</>
                              )}
                            </td>
                            <td className="border border-blue-800 py-2">
                              {editingStudentId === student._id ? (
                                <button onClick={() => handleSave(student._id)}><FaSave className="text-green-700" /></button>
                              ) : (
                                <>
                                  <button className="p-2" onClick={() => handleEdit(student._id)}><FaEdit className="text-blue-700" /></button>
                                  <button onClick={() => handleDelete(student._id)}><FaTrashAlt className="text-red-600" /></button>
                                </>
                              )}
                            </td>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateGrade;
