import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const CreateCourse = ({ cookies }) => {
  const userState = useSelector((s) => s.user);
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [los, setLos] = useState([]);
  const [selectedLos, setSelectedLos] = useState([]);
  const [assessmentName, setAssessmentName] = useState('');
  const [grade, setGrade] = useState('');
  const [weight, setWeight] = useState('');
  const coursesList = useRef();

  useEffect(() => {
    async function getCourses() {
      try {
        // Fetch the array of course IDs assigned to the user
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
    
        // Fetch details for each course ID
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
    
        // Wait for all course details to be fetched
        const coursesDetails = await Promise.all(courseDetailsPromises);
    
        // Filter out null responses (failed fetches)
        const validCoursesDetails = coursesDetails.filter(detail => detail !== null);
    
        // Log the details of all valid courses
        validCoursesDetails.forEach((courseDetail, index) => {
          console.log(`Course ${index + 1} data:`, courseDetail);
        });
    
        // Create the courses array with valid details
        const courses = validCoursesDetails.map(e => ({
          name: e.data.name,
          id: e.data._id,
          code: e.data.code,
          // competences: e.data.qualityCompetencies,
          aims: e.data.courseAims,
          information: e.data.courseInformation
        }));
    
        console.log("courses from server:", courses);
        setCourses(courses);
    
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    }
    

    getCourses();
       
  }, []);
  
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
      // setLos =setLearningOutcomes(data);
      setLos(data)
    } catch (error) {
      console.error("Error fetching learning outcomes: ", error);
    }
  }
  useEffect(() => {
    // getLosForCourse(courseId);
    getLearningOutcomes()
    

    if (selectedCourse) {
      getLosForCourse(selectedCourse);
    }
  },[]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "course") {
      setSelectedCourse(value);
    } else if (name === "assessment") {
      setAssessmentName(value);
    } else if (name === "grade") {
      setGrade(value);
    } else if (name === "weight") {
      setWeight(value);
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedLos((prevSelectedLos) =>
      checked
        ? [...prevSelectedLos, value]
        : prevSelectedLos.filter((lo) => lo !== value)
    );
  };

  const addAssessment = async () => {
    if (!selectedCourse || !assessmentName || !grade || !weight) {
      console.error("All fields are required");
      return;
    }

    const assessmentData = {
      assessment: assessmentName,
      grade: Number(grade),
      LO: selectedLos,
      courses: selectedCourse,
      weight: Number(weight),
    };

    try {
      const response = await fetch("http://localhost:8087/assessment-methods/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userState.token,
        },
        body: JSON.stringify(assessmentData),
      });

      if (response.ok) {
        console.log("Assessment method created successfully");
        
      } else {
        console.error("Failed to create assessment method");
      }
    } catch (error) {
      console.error("Error creating assessment method: ", error);
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
          <h2 className="font-bold text-form mb-4 text-3xl text-center">Create Assessment Method</h2>
          <form onSubmit={(e) => { e.preventDefault(); }}>
            <div className="flex flex-col gap-4">
              <label htmlFor="course" className="text-form font-bold w-1/3">Course Title:</label>
              <select
                ref={coursesList}
                id="course"
                name="course"
                className="choose-form w-full px-10"
                onChange={handleChange}
              >
                <option className="text-left" disabled selected>
                  Choose a Course
                </option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>

              <label htmlFor="assessment" className="text-form font-bold">
                Assessment Name:
              </label>
              <input
                placeholder="Assessment name"
                type="text"
                id="assessment"
                name="assessment"
                value={assessmentName}
                onChange={handleChange}
                className="input-field border-1 border-gray-800"
              />

              <label htmlFor="grade" className="text-form font-bold">
                Assessment Grade:
              </label>
              <input
                placeholder="Assessment grade"
                type="number"
                id="grade"
                name="grade"
                value={grade}
                onChange={handleChange}
                className="input-field border-1 border-gray-800"
              />

              <label htmlFor="weight" className="text-form font-bold">
                Assessment Weight:
              </label>
              <input
                placeholder="Assessment weight"
                type="number"
                id="weight"
                name="weight"
                value={weight}
                onChange={handleChange}
                className="input-field border-1 border-gray-800"
              />

<label className="text-form font-bold">
  Learning Objectives:
</label>
{Array.isArray(los) && los.length > 0 ? (
  los.map((lo, index) => (
    <div key={lo._id} className="flex items-center">
      <input
        type="checkbox"
        id={`lo-${index}`}
        value={lo._id}
        onChange={handleCheckboxChange}
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
                type="button"
                onClick={addAssessment}
                className="px-6 mt-12 mr-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                disabled={!selectedCourse || !assessmentName || !grade || !weight}
              >
                Add Assessment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
