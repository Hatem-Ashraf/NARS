import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { FaTrash, FaEdit, FaSave } from 'react-icons/fa';

const CreateCourse = ({ cookies }) => {
  const userState = useSelector((s) => s.user);
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState([]);
  const coursesList = useRef();
  const [editMode, setEditMode] = useState({ id: null, field: null });
  const [newValues, setNewValues] = useState({});

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
      const topicsResponse = await fetch(`http://localhost:8087/topic`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      if (!topicsResponse.ok) {
        throw new Error('Failed to fetch topics');
      }

      const topicsData = await topicsResponse.json();
      const courseTopics = topicsData.topics.filter(topic => topic.course === selectedId);
      setTopics(courseTopics);

    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const handleEdit = (id, field) => {
    setEditMode({ id, field });
    const currentValue = topics.find(topic => topic._id === id)[field];
    setNewValues({ ...newValues, [field]: currentValue });
  };

  const handleSave = async (id, field) => {
    try {
      const requestBody = { ...newValues, isCovered: true };
  
      const response = await fetch(`http://localhost:8087/topic/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        const updatedTopics = topics.map((topic) =>
          topic._id === id ? { ...topic, ...newValues, isCovered: true } : topic
        );
        setTopics(updatedTopics);
  
        setEditMode({ id: null, field: null });
      } else {
        console.error(`Failed to update ${field} for topic with ID ${id}`);
      }
    } catch (error) {
      console.error(`Error updating ${field} for topic with ID ${id}:`, error);
    }
  };

  const handleValueChange = (field, value) => {
    setNewValues({ ...newValues, [field]: value });
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
          <h2 className="font-bold text-form mb-4 text-3xl text-center">View Topic in Course </h2>
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
                    <th className="py-2">Topic Title</th>
                    <th className="py-2">Week</th>
                    <th className="py-2">Planned Hours</th>
                    <th className="py-2">Is Covered</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {topics.map((topic) => (
                    <tr key={topic._id}>
                      <td className="border px-4 py-2">
                        {editMode.id === topic._id && editMode.field === 'title' ? (
                          <input
                            type="text"
                            value={newValues.title || topic.title}
                            onChange={(e) => handleValueChange('title', e.target.value)} />
                        ) : (
                          <span onClick={() => handleEdit(topic._id, 'title')}>{topic.title}</span>
                        )}
                      </td>
                      <td className="border px-4 py-2">
                        {topic.week}
                      </td>
                      <td className="border px-4 py-2">
                        {topic.plannedHours}
                      </td>
                      <td className="border px-4 py-2">
                        {topic.isCovered ? '✓' : '✗'}
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
