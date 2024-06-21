import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { FaTrash, FaEdit, FaSave } from 'react-icons/fa';

const CreateCourse = ({ cookies }) => {
  const userState = useSelector((s) => s.user);
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [learningOutcomes, setLearningOutcomes] = useState([]);
  const coursesList = useRef();
  const [editMode, setEditMode] = useState({ id: null, field: null });
  const [newValues, setNewValues] = useState({ LO: [] });

  useEffect(() => {
    async function getCourses() {
      try {
        const response = await fetch(`http://localhost:8081/getAssignedCourses/${userState._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch assigned courses');
        }

        const coursesData = await response.json();
        const courseIds = coursesData.data;

        const courseDetailsPromises = courseIds.map(async (courseId) => {
          const response = await fetch(`http://localhost:8087/newCourse/${courseId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookies.token}`,
            },
          });

          if (!response.ok) {
            console.error(`Failed to fetch course details for ID: ${courseId}`);
            return null;
          }

          return response.json();
        });

        const coursesDetails = await Promise.all(courseDetailsPromises);
        const validCoursesDetails = coursesDetails.filter(detail => detail !== null);
        const courses = validCoursesDetails.map(e => ({
          name: e.data.name,
          id: e.data._id,
        }));

        setCourses(courses);

      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    }

    getCourses();
  }, [userState, cookies.token]);

  const handleCourseChange = async (e) => {
    const selectedId = e.target.value;
    const selected = courses.find(course => course.id === selectedId);
    setSelectedCourse(selected);

    try {
      const assessmentsResponse = await fetch(`http://localhost:8087/assessment-methods-under-course/${selectedId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      if (!assessmentsResponse.ok) {
        throw new Error('Failed to fetch assessments');
      }

      const assessmentsData = await assessmentsResponse.json();
      setAssessments(assessmentsData);

      // Fetch learning outcomes
      const losResponse = await fetch(`http://localhost:8087/los/courses/${selectedId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      if (!losResponse.ok) {
        throw new Error('Failed to fetch learning outcomes');
      }

      const losData = await losResponse.json();
      setLearningOutcomes(losData);

    } catch (error) {
      console.error('Error fetching assessments or learning outcomes:', error);
    }
  };

  const handleEdit = (id, field) => {
    setEditMode({ id, field });
    const currentValue = assessments.find(a => a._id === id)[field];
    setNewValues({ ...newValues, [field]: field === 'LO' ? currentValue.map(lo => lo._id) : currentValue });
  };

  const handleSave = async (id, field) => {
    try {
      const requestBody = field === 'LO' ? { LO: newValues.LO } : { [field]: newValues[field] };

      const response = await fetch(`http://localhost:8087/assessment-methods/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        // Update assessments state with the new LO values
        const updatedAssessments = assessments.map((assessment) =>
          assessment._id === id ? { ...assessment, [field]: field === 'LO' ? newValues.LO.map(loId => ({ _id: loId, code: learningOutcomes.find(lo => lo._id === loId).code })) : newValues[field] } : assessment
        );
        setAssessments(updatedAssessments);

        setEditMode({ id: null, field: null });
      } else {
        console.error(`Failed to update ${field} for assessment with ID ${id}`);
      }
    } catch (error) {
      console.error(`Error updating ${field} for assessment with ID ${id}:`, error);
    }
  };

  const handleValueChange = (field, value) => {
    setNewValues({ ...newValues, [field]: value });
  };

  const toggleLoSelection = (loId) => {
    setNewValues(prevValues => {
      const updatedLo = prevValues.LO.includes(loId)
        ? prevValues.LO.filter(id => id !== loId)
        : [...prevValues.LO, loId];
      return { ...prevValues, LO: updatedLo };
    });
  };

  const deleteAssessment = async (id) => {
    try {
      await fetch(`http://localhost:8087/assessment-methods/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      });
      const updatedAssessments = assessments.filter(assessment => assessment._id !== id);
      setAssessments(updatedAssessments);
    } catch (error) {
      console.error('Error deleting assessment:', error);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`
        body {
          background-color: rgb(243 244 246);
          font-family: Arial, sans-serif;
        }
      `}</style>
      <div className="mt-5 flex justify-center min-h-screen">
        <div className="p-20 max-w-3xl bg-gray-100 w-full shadow-2xl rounded-3xl">
          <h2 className="font-bold text-form mb-4 text-3xl text-center">Update Assessment Method</h2>
          <form onSubmit={(e) => { e.preventDefault(); }}>
            <div className="flex flex-col gap-4">
              <label htmlFor="course" className="text-form font-bold w-1/3">Course Title:</label>
              <select
                ref={coursesList}
                id="course"
                name="course"
                className="choose-form w-full px-10"
                onChange={handleCourseChange}
              >
                <option disabled selected>
                  Choose a Course
                </option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
            </div>

            <div className="mt-5">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2">Assessment Name</th>
                    <th className="py-2">Grade</th>
                    <th className="py-2">Weight</th>
                    <th className="py-2">LO Code</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assessments.map((assessment) => (
                    <tr key={assessment._id}>
                      <td className="border px-4 py-2">
                        {editMode.id === assessment._id && editMode.field === 'assessment' ? (
                          <input
                            type="text"
                            value={newValues.assessment || assessment.assessment}
                            onChange={(e) => handleValueChange('assessment', e.target.value)} />
                        ) : (
                          <span onClick={() => handleEdit(assessment._id, 'assessment')}>{assessment.assessment}</span>
                        )}
                      </td>
                      <td className="border px-4 py-2">
                        {editMode.id === assessment._id && editMode.field === 'grade' ? (
                          <input
                            type="text"
                            value={newValues.grade || assessment.grade}
                            onChange={(e) => handleValueChange('grade', e.target.value)}
                          />
                        ) : (
                          <span onClick={() => handleEdit(assessment._id, 'grade')}>{assessment.grade}</span>
                        )}
                      </td>
                      <td className="border px-4 py-2">
                        {editMode.id === assessment._id && editMode.field === 'weight' ? (
                          <input
                            type="text"
                            value={newValues.weight || assessment.weight}
                            onChange={(e) => handleValueChange('weight', e.target.value)}
                          />
                        ) : (
                          <span onClick={() => handleEdit(assessment._id, 'weight')}>{assessment.weight}</span>
                        )}
                      </td>
                      <td className="border px-4 py-2">
                        {editMode.id === assessment._id && editMode.field === 'LO' ? (
                          <div>
                            {learningOutcomes.map((lo, index) => (
                              <label key={lo._id}>
                                <input
                                  type="checkbox"
                                  checked={newValues.LO.includes(lo._id)}
                                  onChange={() => toggleLoSelection(lo._id)}
                                />
                                {lo.code}
                              </label>
                            ))}
                          </div>
                        ) : (
                          <span onClick={() => handleEdit(assessment._id, 'LO')}>
                            {assessment.LO.map((lo, index) => (
                              <React.Fragment key={lo._id}>
                                {lo.code}
                                {index < assessment.LO.length - 1 && ', '}
                              </React.Fragment>
                            ))}
                          </span>
                        )}
                      </td>
                      <td className="border px-4 py-2">
                        {editMode.id === assessment._id ? (
                          <FaSave onClick={() => handleSave(assessment._id, editMode.field)} style={{ cursor: 'pointer' }} />
                        ) : (
                          <>
                            <FaTrash className="mb-2" onClick={() => deleteAssessment(assessment._id)} style={{ cursor: 'pointer' }} />
                            <FaEdit onClick={() => handleEdit(assessment._id, 'assessment')} style={{ cursor: 'pointer' }} />
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
