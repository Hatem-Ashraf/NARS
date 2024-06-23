import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CreateCourse = ({ cookies }) => {
  const userState = useSelector((s) => s.user);
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const coursesList = useRef();

  // State for Topic Statistics chart
  const [topicChartData, setTopicChartData] = useState({
    labels: [],
    datasets: [],
  });

  // State for duplicated Topic Statistics chart (for assessment)
  const [assessmentChartData, setAssessmentChartData] = useState({
    labels: [],
    datasets: [],
  });

  // State for new flow chart
  const [newChartData, setNewChartData] = useState({
    labels: [],
    datasets: [],
  });

  const avgOptions = {
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Average LOS",
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  const topicChartOptions = {
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Topic Statistics",
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  const assessmentChartOptions = {
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Assessment Statistics",
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  const newChartOptions = {
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "New Flow Chart",
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  useEffect(() => {
    async function getCourses() {
      try {
        const response = await fetch(
          `http://localhost:8081/getAssignedCourses/${userState._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookies.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch assigned courses");
        }

        const coursesData = await response.json();
        const courseIds = coursesData.data;

        const courseDetailsPromises = courseIds.map(async (courseId) => {
          const response = await fetch(
            `http://localhost:8087/newCourse/${courseId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.token}`,
              },
            }
          );

          if (!response.ok) {
            console.error(`Failed to fetch course details for ID: ${courseId}`);
            return null;
          }

          return response.json();
        });

        const coursesDetails = await Promise.all(courseDetailsPromises);
        const validCoursesDetails = coursesDetails.filter(
          (detail) => detail !== null
        );
        const courses = validCoursesDetails.map((e) => ({
          name: e.data.name,
          id: e.data._id,
          code: e.data.code,
          aims: e.data.courseAims,
          information: e.data.courseInformation,
        }));

        setCourses(courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }

    getCourses();
  }, [userState._id, cookies.token]);

  // Fetch Topic Statistics Data
  useEffect(() => {
    async function fetchTopicStatistics(courseId) {
      try {
        const response = await fetch(
          `http://localhost:8087/topic/loCoverage/${courseId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookies.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch topic statistics");
        }

        const data = await response.json();
        const loCoverage = data;

        const loDetailsPromises = loCoverage.map(async (lo) => {
          const response = await fetch(`http://localhost:8087/los/${lo.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookies.token}`,
            },
          });

          if (!response.ok) {
            console.error(`Failed to fetch LO details for ID: ${lo.id}`);
            return null;
          }

          const loDetails = await response.json();
          return { ...loDetails.lo, coverage: lo.coverage };
        });

        const loDetails = await Promise.all(loDetailsPromises);
        const validLoDetails = loDetails.filter((detail) => detail !== null);
        const topicChartData = buildTopicChartData(validLoDetails);
        setTopicChartData(topicChartData);
        setAssessmentChartData(topicChartData); // Duplicating the data for assessment chart
      } catch (error) {
        console.error("Error fetching topic statistics: ", error);
      }
    }

    if (selectedCourse) {
      fetchTopicStatistics(selectedCourse);
    }
  }, [selectedCourse, cookies.token]);

  const buildTopicChartData = (loDetails) => {
    const labels = loDetails.map((lo) => lo.code);
    const coverageData = loDetails.map((lo) => parseFloat(lo.coverage));
    const targetData = loDetails.map((lo) => lo.target);

    return {
      labels,
      datasets: [
        {
          label: "Coverage",
          data: coverageData,
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
        },
        {
          label: "Target",
          data: targetData,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  // Fetch new chart data
  useEffect(() => {
    async function fetchNewChartData(courseId) {
      try {
        const response = await fetch(
          `http://localhost:8087/calculateLOCoverage/${courseId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookies.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch new chart data");
        }

        const data = await response.json();
        const loCoverage = data.learningOutcomeTotalCoverage;

        const loDetailsPromises = loCoverage.map(async (lo) => {
          const response = await fetch(`http://localhost:8087/los/${lo.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookies.token}`,
            },
          });

          if (!response.ok) {
            console.error(`Failed to fetch LO details for ID: ${lo.id}`);
            return null;
          }

          const loDetails = await response.json();
          return { ...loDetails.lo, coverage: lo.coverage };
        });

        const loDetails = await Promise.all(loDetailsPromises);
        const validLoDetails = loDetails.filter((detail) => detail !== null);
        const newChartData = buildNewChartData(validLoDetails);
        setNewChartData(newChartData);
      } catch (error) {
        console.error("Error fetching new chart data: ", error);
      }
    }

    if (selectedCourse) {
      fetchNewChartData(selectedCourse);
    }
  }, [selectedCourse, cookies.token]);

  const buildNewChartData = (loDetails) => {
    const labels = loDetails.map((lo) => lo.code);
    const coverageData = loDetails.map((lo) => parseFloat(lo.coverage));
    const targetData = loDetails.map((lo) => lo.target);

    return {
      labels,
      datasets: [
        {
          label: "Coverage",
          data: coverageData,
          backgroundColor: "rgba(255, 159, 64, 0.2)",
          borderColor: "rgba(255, 159, 64, 1)",
          borderWidth: 1,
        },
        {
          label: "Target",
          data: targetData,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <style>{`
        body {
          background-color: rgb(243 244 246);
          font-family: Arial, sans-serif;
        }
      `}</style>
      <div className="mt-5 flex justify-center min-h-screen w-full">
        <div className="p-20 max-w-3xl bg-gray-100 w-full shadow-2xl rounded-3xl">
          <h2 className="font-bold text-form mb-4 text-3xl text-center text-blue-800">
            Flow charts
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="flex flex-col gap-4">
              <label
                htmlFor="course"
                className="text-form font-bold w-1/3 text-blue-800"
              >
                Course Title:
              </label>
              <select
                ref={coursesList}
                id="course"
                name="course"
                className="choose-form w-full px-10"
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option className="text-left" disabled selected>
                  Choose a Course
                </option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
          </form>
          <div className="mt-8">
            <div className="flex justify-center items-center">
              <div className="lg:h-[70vh] h-[50vh] p-4 border rounded-lg bg-white w-full">
                <Bar data={topicChartData} options={topicChartOptions} />
              </div>
            </div>
            <div className="mt-8">
              <div className="flex justify-center items-center">
                <div className="lg:h-[70vh] h-[50vh] p-4 border rounded-lg bg-white w-full">
                  <Bar
                    data={assessmentChartData}
                    options={assessmentChartOptions}
                  />
                </div>
              </div>
              <div className="flex justify-center items-center mt-8">
                <div className="lg:h-[70vh] h-[50vh] p-4 border rounded-lg bg-white w-full">
                  <Bar data={newChartData} options={avgOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
