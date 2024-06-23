import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const CreateCourse = ({ cookies }) => {
  const userState = useSelector((s) => s.user);
  const router = useRouter();
  const [topicData, setTopicData] = useState({
    title: "",
    week: "",
    plannedHours: "",
    actualHours: "",
    learningOutcomes: [],
    isCovered: true, // Default value
    possibleCompensationActions: "", // Default value
    course: cookies._id,
  });

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState({});
  const [learningOutcomes, setLearningOutcomes] = useState([]);
  const coursesList = useRef();

  useEffect(() => {
    async function getCourses() {
      try {
        const response = await fetch(`http://localhost:8081/getAssignedCourses/${userState._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userState.token,
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
              Authorization: "Bearer " + userState.token,
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
    
        validCoursesDetails.forEach((courseDetail, index) => {
          console.log(`Course ${index + 1} data:`, courseDetail);
        });
    
        const courses = validCoursesDetails.map(e => ({
          name: e.data.name,
          id: e.data._id,
          code: e.data.code,
          aims: e.data.courseAims,
          information: e.data.courseInformation
        }));
    
        console.log("courses from server:", courses);
        setCourses(courses);
    
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    }

    async function getLearningOutcomes() {
      try {
        const response = await fetch(`http://localhost:8087/los/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userState.token,
          },
        });

        const data = await response.json();
        setLearningOutcomes(data);
      } catch (error) {
        console.error("Error fetching learning outcomes: ", error);
      }
    }
    
    getCourses();
    getLearningOutcomes();
  }, [cookies.token, userState._id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTopicData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCourseChange = async () => {
    const selectedCourseId = coursesList.current.value;
    console.log(selectedCourseId);

    try {
      const response = await fetch(
        `http://localhost:8087/original-courses/${selectedCourseId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userState.token,
          },
        }
      );

      const data = await response.json();
      if (!data.data) return;

      const courseDetails = data.data;
      console.log("Course details from server:", courseDetails);
      setSelectedCourse(courseDetails);
      setTopicData((prevData) => ({
        ...prevData,
        course: courseDetails._id,
      }));
    } catch (error) {
      console.error("Error fetching course details: ", error);
    }
  };
  const handleOutcomeChange = (e) => {
    const { value, checked } = e.target;
    const updatedOutcomes = [...topicData.learningOutcomes];

    if (checked) {
      updatedOutcomes.push(value);
    } else {
      const index = updatedOutcomes.indexOf(value);
      if (index > -1) {
        updatedOutcomes.splice(index, 1);
      }
    }

    setTopicData((prevData) => ({
      ...prevData,
      learningOutcomes: updatedOutcomes,
    }));
    console.log(topicData)
  };
  

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8087/topic/${topicData.course}`, {
        method: "POST",
        body: JSON.stringify(topicData),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + userState.token,
        },
      });
      const data = await response.json();
      console.log(data);

      const updatedCourse = {
        ...selectedCourse,
        topics: [...selectedCourse.topics, data.createdTopicId],
      };

      setSelectedCourse(updatedCourse);

      setTopicData({
        title: "",
        week: "",
        plannedHours: "",
        actualHours: "",
        learningOutcomes: [],
        isCovered: true,
        possibleCompensationActions: "",
        course: cookies._id,
      });
      alert("Topic added successfully!");
    } catch (error) {
      console.error("Error creating topic: ", error);
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
          <h2 className="font-bold text-form mb-4 text-3xl text-center">Create Topic</h2>
          <form onSubmit={submitHandler}>
            <div className="flex flex-col gap-4">
              <label htmlFor="course" className="text-form font-bold">Course Title:</label>
              <select
                ref={coursesList}
                id="course"
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

              <label htmlFor="title" className="text-form font-bold">Topic Title:</label>
              <input
                placeholder="Topic Title"
                type="text"
                id="title"
                name="title"
                value={topicData.title}
                onChange={handleChange}
                className="input-field border-1 border-gray-800"
              />
              <label htmlFor="week" className="text-form font-bold">Week:</label>
              <input
                placeholder="Week"
                type="number"
                id="week"
                name="week"
                value={topicData.week}
                onChange={handleChange}
                className="input-field border-1 border-gray-800"
              />
              <label htmlFor="plannedHours" className="text-form font-bold">Planned Hours:</label>
              <input
                placeholder="Planned hours"
                type="number"
                id="plannedHours"
                name="plannedHours"
                value={topicData.plannedHours}
                onChange={handleChange}
                className="input-field border-1 border-gray-800"
              />
              <label htmlFor="actualHours" className="text-form font-bold">Actual Hours:</label>
              <input
                placeholder="Actual hours"
                type="number"
                id="actualHours"
                name="actualHours"
                value={topicData.actualHours}
                onChange={handleChange}
                className="input-field border-1 border-gray-800"
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isCovered"
                  name="isCovered"
                  checked={topicData.isCovered}
                  onChange={(e) => setTopicData((prevData) => ({
                    ...prevData,
                    isCovered: e.target.checked,
                    possibleCompensationActions: e.target.checked ? "" : prevData.possibleCompensationActions,
                  }))}
                  className="mr-2"
                />
                <label htmlFor="isCovered" className="text-form">Covered</label>
              </div>
              {!topicData.isCovered && (
                <input
                  placeholder="Possible Compensation Actions"
                  type="text"
                  id="possibleCompensationActions"
                  name="possibleCompensationActions"
                  value={topicData.possibleCompensationActions}
                  onChange={handleChange}
                  className="input-field border-1 border-gray-800"
                />
              )}
              
              <label className="text-form font-bold">
                Learning Objectives:
              </label>
              {Array.isArray(learningOutcomes) && learningOutcomes.length > 0 ? (
                learningOutcomes.map((lo, index) => (
                  <div key={lo._id} className="flex items-center">
                    <input                      type="checkbox"
                      id={`lo-${index}`}
                      value={lo._id}
                      onChange={handleOutcomeChange}
                      className="mr-2"
                    />
                    <label htmlFor={`lo-${index}`} className="text-form">{lo.name} {lo.code}</label>
                  </div>
                ))
              ) : (
                <p>Loading Learning Objectives...</p>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                onSubmit={submitHandler}
                className="px-6 mt-12 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
              >
                Create Topics
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;

