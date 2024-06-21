import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const CreateCourse = ({ cookies }) => {
  const userState = useSelector((s) => s.user);
  const router = useRouter();

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [courseLOs, setCourseLOs] = useState([]);
  const [gradeDistribution, setGradeDistribution] = useState(null);
  const [topics, setTopics] = useState([]);
  const [courseData, setCourseData] = useState(null);
  const [competences, setCompetences] = useState(null);

  const coursesList = useRef();

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
          code: e.data.code,
          academicYear: e.data.academicYear,
          aims: e.data.courseAims,
          information: e.data.courseInformation,
        }));

        setCourses(courses);

      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    }

    getCourses();

  }, [cookies.token, userState._id]);

  const handleCourseChange = async (e) => {
    const selectedId = e.target.value;
    const selected = courses.find(course => course.id === selectedId);
    setSelectedCourse(selected);
    console.log("Selected Course:", selected);

    try {
      const assessmentsResponse = await fetch(`http://localhost:8087/assessment-methods-under-course/${selectedId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      });
      console.log("Assessments Response:", assessmentsResponse);

      if (!assessmentsResponse.ok) {
        throw new Error('Failed to fetch assessments');
      }

      const assessmentsData = await assessmentsResponse.json();
      setAssessments(assessmentsData);
      console.log("Assessments Data:", assessmentsData);

      const losResponse = await fetch(`http://localhost:8087/los/courses/${selectedId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      });
      console.log("LOs Response:", losResponse);

      if (!losResponse.ok) {
        throw new Error('Failed to fetch learning outcomes');
      }

      const losData = await losResponse.json();
      setCourseLOs(losData);
      console.log("LOs Data:", losData);

      const gradeDistributionResponse = await fetch(`http://localhost:8087/grade-distribution/${selectedId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      if (!gradeDistributionResponse.ok) {
        throw new Error('Failed to fetch grade distribution');
      }

      const gradeDistributionData = await gradeDistributionResponse.json();
      setGradeDistribution(gradeDistributionData.data.gradeDistribution);
      console.log("Grade Distribution Data:", gradeDistributionData);

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
      console.log("Topics Data:", courseTopics);

      const courseResponse = await fetch(`http://localhost:8087/newCourse/${selectedId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      if (!courseResponse.ok) {
        throw new Error('Failed to fetch course data');
      }

      const courseData = await courseResponse.json();
      setCourseData(courseData.data);
      console.log("Course Data:", courseData);

      // Extract program, department, faculty, and id
      const { program, department, faculty, _id } = courseData.data;

      // Post to the competences API
      const competencesResponse = await fetch(`http://localhost:8085/competences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
        body: JSON.stringify({
          program,
          department,
          faculty,
          id: _id,
        }),
      });
      console.log(competencesResponse)

      if (!competencesResponse.ok) {
        throw new Error('Failed to fetch competences');
      }

      const competencesData = await competencesResponse.json();
      setCompetences(competencesData.selectedCompetences);
      console.log("Competences Data:", competencesData);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const uniqueLOCodes = assessments.length > 0 
    ? [...new Set(assessments.flatMap(assessment => assessment.LO.map(lo => lo.code)))]
    : [];

  

  return (
    <div className="flex flex-row min-h-screen mt-5 mb-5">
      <div className="p-20 bg-gray-100 w-full shadow-2xl rounded-3xl">
        <h2 className="font-bold text-form mb-4 text-3xl text-center">Course Specs</h2>
        <div className="flex flex-col gap-4">
          <label htmlFor="title" className="text-form font-bold w-1/3">Course Title:</label>
          <select
            ref={coursesList}
            id="small"
            className="choose-form w-full px-10"
            onChange={handleCourseChange}
            defaultValue=""
          >
            <option className="text-left" value="" disabled>
              Choose a Course
            </option>
            {courses.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}{" "}
          </select>
        </div>

        <div className="mt-5">
          <h3 className="text-lg font-bold mb-2">Assessment and Learning Outcomes (LO) Code:</h3>
          <table className="border-collapse border border-gray-800 w-full">
            <thead>
              <tr className="bg-gray-200"              >
                <th className="border border-gray-800 px-4 py-2">LO Code</th>
                {assessments.length > 0 ? (
                  assessments.map((assessment, index) => (
                    <th key={index} className="border border-gray-800 px-4 py-2">{assessment.assessment}</th>
                  ))
                ) : (
                  <th className="border border-gray-800 px-4 py-2">-</th>
                )}
              </tr>
            </thead>
            <tbody>
              {uniqueLOCodes.length > 0 ? (
                uniqueLOCodes.map((loCode, index) => (
                  <tr key={index} className="bg-white">
                    <td className="border border-gray-800 px-4 py-2">{loCode}</td>
                    {assessments.map((assessment, idx) => (
                      <td key={idx} className="border border-gray-800 px-4 py-2">
                        {assessment.LO.some(lo => lo.code === loCode) ? "✔️" : ""}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr className="bg-white">
                  <td className="border border-gray-800 px-4 py-2">-</td>
                  <td className="border border-gray-800 px-4 py-2">-</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-5">
          <h3 className="text-lg font-bold mb-2">Grade Distribution:</h3>
          <table className="border-collapse border border-gray-800 w-full">
            <thead>
              <tr className="bg-gray-200">
                {gradeDistribution ? (
                  Object.keys(gradeDistribution).map((grade, index) => (
                    <th key={index} className="border border-gray-800 px-4 py-2">{grade}</th>
                  ))
                ) : (
                  <th className="border border-gray-800 px-4 py-2">-</th>
                )}
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                {gradeDistribution ? (
                  Object.values(gradeDistribution).map((value, index) => (
                    <td key={index} className="border border-gray-800 px-4 py-2">{value}</td>
                  ))
                ) : (
                  <td className="border border-gray-800 px-4 py-2">-</td>
                )}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-5">
          <h3 className="text-lg font-bold mb-2 bg-red-500 text-white p-2">Course Data :</h3>
          {selectedCourse ? (
            <div>
              <p>
                <span className="p-2 mb-2 rounded text-red-700">Academic Year:</span> {selectedCourse.academicYear || "-"}  
                <span className="p-2 mb-2 rounded text-red-700">Code:</span> {selectedCourse.code || "-"}
              </p>
              <h4 className="font-bold mb-2 text-lg text-red-700">Course Aims:</h4>
              <p>{selectedCourse.aims || "-"}</p>
            </div>
          ) : (
            <div>
              <p>
                <span className="p-2 mb-2 rounded text-red-700 font-bold">Academic Year:</span>-  
                <span className="p-2 mb-2 rounded text-red-700 font-bold">Code:</span>-
              </p>
              <span className="font-bold mb-2 text-lg text-red-700  p-2">Course Aims:</span>-
            </div>
          )}
        </div>

        {topics.map((topic) => (
          <div key={topic._id} className="mt-5">
            <p>
              <span className="p-2 mb-2 rounded text-red-700 font-bold">Title :</span> {topic.title} |
              <span className="p-2 mb-2 rounded text-red-700 font-bold">Week:</span> {topic.week}  
              <span className="p-2 mb-2 rounded text-red-700 font-bold">Hours:</span> {topic.plannedHours}   
            </p>
          </div>
        ))}

       
      </div>
    </div>
  );
}

export default CreateCourse;

