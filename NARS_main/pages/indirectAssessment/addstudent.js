import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const CreateCourse = ({ cookies }) => {
  const userState = useSelector((s) => s.user);
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState({});
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [topicData, setTopicData] = useState({
    name: "",
    department: "",
    program: "",
    faculty: "",
    course: "",
  });
  const coursesList = useRef();
  const departmentsList = useRef();
  const programsList = useRef();

  useEffect(() => {
    async function getDepartments() {
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
          const departmentList = data.data.map((department) => ({
            name: department.name,
            id: department._id,
            facultyId: department.facultyId,
          }));
          setDepartments(departmentList);
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    }

    getDepartments();

  }, [cookies.token]);

  useEffect(() => {
    async function getCourses() {
      try {
        // Fetch the array of course IDs assigned to the user
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
    
        // Fetch details for each course ID
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

  const closeMsg = () => {
    setMsg("");
  };

  const getPrograms = async (departmentId, facultyId) => {
    try {
      const response = await fetch(`http://localhost:8086/${facultyId}/department/${departmentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      const data = await response.json();
      if (data.status === "success" && Array.isArray(data.data.programs)) {
        const programList = data.data.programs.map((program) => ({
          name: program.name,
          id: program._id,
        }));
        setPrograms(programList);
      } else {
        console.error("Unexpected data format:", data);
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTopicData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "department") {
      const selectedDepartment = departments.find(dept => dept.id === value);
      if (selectedDepartment) {
        setTopicData(prevData => ({
          ...prevData,
          faculty: selectedDepartment.facultyId
        }));
        getPrograms(value, selectedDepartment.facultyId);
      }
    }
  };

  const handleCourseChange = () => {
    const selectedCourseId = coursesList.current.value;
    if (selectedCourseId) {
      setTopicData((prevData) => ({
        ...prevData,
        course: selectedCourseId,
      }));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Validate that course is selected
    if (!topicData.course) {
      console.error("Course must be selected");
      return;
    }

    try {
      const studentData = {
        name: topicData.name,
        program: topicData.program,
        faculty: topicData.faculty,
        department: topicData.department,
        courses: [topicData.course],
      };

      const response = await fetch(`http://localhost:8087/student/`, {
        method: "POST",
        body: JSON.stringify(studentData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userState.token}`,
        },
      });

      const data = await response.json();
      console.log(data);

      // Reset input fields after adding a student
      setTopicData({
        name: "",
        department: "",
        program: "",
        faculty: "",
        course: "",
      });
      coursesList.current.value = "";
      departmentsList.current.value = "";
      programsList.current.value = "";

    } catch (error) {
      console.error("Error creating student: ", error);
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
          <h2 className="font-bold text-form mb-4 text-3xl text-center text-blue-800">Add Student</h2>
          <form onSubmit={submitHandler}>
            <label htmlFor="name" className="text-form font-bold text-blue-500">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              className="input-form w-full px-10"
              value={topicData.name}
              onChange={handleChange}
              placeholder="Enter name"
            />
            <div className="flex flex-col gap-4">
              <label htmlFor="department" className="text-form font-bold text-blue-500">Department:</label>
              <select
                ref={departmentsList}
                id="department"
                className="choose-form w-full px-10"
                onChange={(e) => handleChange(e)}
                name="department"
              >
                <option className="text-left" disabled selected>
                  Choose a Department
                </option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>{department.name}</option>
                ))}
              </select>

              <label htmlFor="program" className="text-form font-bold text-blue-500">Program:</label>
              <select
                ref={programsList}
                id="program"
                className="choose-form w-full px-10"
                onChange={(e) => handleChange(e)}
                name="program"
              >
                <option className="text-left text-blue-300" disabled selected>
                  Choose a Program
                </option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>{program.name}</option>
                ))}
              </select>

              <label htmlFor="title" className="text-form font-bold w-1/3">Course Title:</label>
              <select
                ref={coursesList}
                id="small"
                class="choose-form w-full px-10"
                onChange={handleCourseChange}
              >
                <option className="text-left" disabled selected>
                  Choose a Course
                </option>
                {courses.map((e) => {
                  return <option value={e.id}>{e.name}</option>;
                })}{" "}
              </select>

              <button type="submit" className="submit-button mt-5 bg-blue-800 text-white p-3 w-1/3 right-1">
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

);
};

export default CreateCourse;

