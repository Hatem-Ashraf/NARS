import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const CreateCourse = ({ cookies }) => {
  const userState = useSelector((s) => s.user);
  const router = useRouter();

  const [courseAssesments, setCourseAssesments] = useState([]);
  const [courseTopics, setCourseTopics] = useState([]);
  const [mapping, setMapping] = useState({});


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
    
    const selectedId = coursesList.current.value;
    console.log("selectedId", selectedId);
  
    const resp = await fetch(`http://localhost:8087/newCourse/${selectedId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userState.token,
      },
    });
  
    const data = await resp.json();
    if (!data.data) return;
  
    const Onecourse = data.data;
    console.log("The selected course:", Onecourse);
  
    // Function to fetch competence details
    const fetchCompetenceDetails = async (competenceId) => {
      const response = await fetch(`http://localhost:8085/compId/${competenceId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userState.token,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch competence details for ID: ${competenceId}`);
      }
  
      const competenceData = await response.json();
      return competenceData.data;
    };
    
    try {
      
// --------------------------------------------------------------------------------

      const gradeDistributionResponse = await fetch(`http://localhost:8087/grade-distribution/${selectedId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userState.token,
        },
      });

      if (!gradeDistributionResponse.ok) {
        throw new Error('Failed to fetch grade distribution');
      }

      const gradeDistributionData = await gradeDistributionResponse.json();
      setGradeDistribution(gradeDistributionData.data.gradeDistribution);
      console.log("Grade Distribution Data:", gradeDistributionData);

// ---------------------------------------------------------------------------------
      const competencesDetailsPromises = Onecourse.competences.map(fetchCompetenceDetails);
      const competencesDetails = await Promise.all(competencesDetailsPromises);
  
      // Categorize competences based on their level
      const categorizedCompetences = {
        A: [],
        B: [],
        C: []
      };
  
      competencesDetails.forEach((competence) => {
        if (competence.level in categorizedCompetences) {
          categorizedCompetences[competence.level].push(competence);
        }
      });
  
      console.log("Categorized competences:", categorizedCompetences);
      console.log("competencesDetails:", competencesDetails);
  
      // Set the selected course with competences details and categories
      console.log({
        ...Onecourse,
        categorizedCompetences
      })
      setTimeout(() => {
        setSelectedCourse({
          ...Onecourse,
          categorizedCompetences
        });
      }, 500);

      const response2 = await fetch(`http://localhost:8087/los/courses/${selectedId}`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      const data = await response2.json();
      
      if (data.status == "success") {
        setCourseLOs(data.data);
        console.log("LOs for the seleteced course:", data)


        //Get the assessments under the course

        const response3 = await fetch(`http://localhost:8087/assessment-methods-under-course/${selectedId}`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.token}`,
          },
        });
  
        const data2 = await response3.json();
        
        if (!data2?.message) {
          setCourseAssesments(data2);
          console.log("Assessments for the seleteced course:", data2)
        } else {
          throw new Error('Failed to fetch Assessments for this course');
        }



        //GET the topics under the course
        const response4 = await fetch(`http://localhost:8087/topic/getTopicsBycourse/${selectedId}`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.token}`,
          },
        });
  
        const data3 = await response4.json();
        
        if (!data3?.error) {
          setCourseTopics(data3.topics);
          console.log("Topics for the seleteced course:", data3)
        } else {
          throw new Error('Failed to fetch Topics for this course');
        }

        
      } else {
        throw new Error('Failed to fetch LOs for this course');
      }

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
        <h2 className="font-bold text-form mb-4 text-3xl text-center">Course Report</h2>
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
              <p>{selectedCourse.courseAims || "-"}</p>

              <h4 className="font-bold mb-2 text-lg text-red-700">Course Information:</h4>
              <p>{selectedCourse.courseInformation || "-"}</p>
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
              { selectedCourse && 
                <>
                <CompetencesList course={selectedCourse} />
                <LOsList LOs={courseLOs} course={selectedCourse} />

                  <TopicsTable 
                    course={selectedCourse}
                    LOs={courseLOs}
                    topics={courseTopics}
                    />
                     <MapAssessmentTable
                      course={selectedCourse} mapping={mapping} LOs={courseLOs} 
                      assessments={courseAssesments}
                      selectedCourse={selectedCourse} 
                    />
                </>
                }
       
      </div>
    </div>
  );
}


const TopicsTable = ({ course, topics, LOs }) => {
  const { categorizedCompetences } = course;

  console.log("Data in Topics table::: ", {course, topics, LOs})
  if (!categorizedCompetences) {
    return <div>Loading Mapping table...</div>;
  }

  // Group topics by week
  const topicsByWeek = topics.reduce((acc, topic) => {
    acc[topic.week] = acc[topic.week] || [];
    acc[topic.week].push(topic);
    return acc;
  }, {});

  return (
    <table className="min-w-full mb-20 mt-20 bg-white">
      <thead>
        <tr className="bg-gray-200">
          <th rowSpan={2} className="p-2 border border-gray-300 w-[10%]">Week</th>
          <th rowSpan={2} className="p-2 border border-gray-300 w-[40%]">Topics</th>
          <th rowSpan={2} className="p-2 border border-gray-300 w-[15%]">Planned Hours</th>
          <th rowSpan={2} className="p-2 border border-gray-300 w-[15%]">Actual Hours</th>
          <th colSpan={LOs.length} className="p-2 border border-gray-300 w-[15%]">Learning Outcomes</th>
          </tr>
          <tr className="bg-gray-200">
          {LOs.map(lo => (
            <th key={lo._id} className="py-2 px-4 border border-gray-300">{lo.code}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Object.entries(topicsByWeek).map(([week, weekTopics]) => (
          <tr key={week}>
            <td className="py-2 px-4 border border-gray-300 text-center">{week}</td>
            <td className="py-2 px-4 border border-gray-300">
              <ul className="list-disc text-indigo-300 mx-4">
                {weekTopics.map(topic => (
                  <li key={topic._id}><span className="text-black">{topic.title}</span></li>
                ))}
              </ul>
            </td>
            <td className="py-2 px-4 border border-gray-300 text-center">
              {Math.max(...weekTopics.map(topic => topic.plannedHours))}
            </td>
            <td className="py-2 px-4 border border-gray-300 text-center">
              {Math.max(...weekTopics.map(topic => topic.actualHours))}
            </td>
            {LOs.map(lo => (
              <td key={lo._id} className="py-2 border border-gray-300 text-center">
                {weekTopics.some(topic => topic.learningOutcomes.includes(lo._id)) ? '✓' : ''}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};



const LOsList = ({ LOs, course }) => {

  const { categorizedCompetences } = course;

  if (!categorizedCompetences) {
    return null;
  }

  if (!LOs) {
    return null;
  }

  if (LOs.length === 0) {
    return (
      <div className="mt-4">
        <h3 className="text-lg font-bold mt-6 mb-2">LOs created for this course</h3>
        <h5 className="font-bold m-5 text-red-600">No LOs created for this course!</h5>
      </div>
    );
  }

  // Group LOs by domain
  const groupedLOs = LOs.reduce((acc, LO) => {
    if (!acc[LO.domain]) {
      acc[LO.domain] = [];
    }
    acc[LO.domain].push(LO);
    return acc;
  }, {});

  const domains = ["Cognitive", "Psychomotor", "Affective"];

  // Create table rows
  const tableRows = [];
  domains.forEach((domain) => {
    tableRows.push(
      <tr key={`${domain}-header`}>
        <td colSpan="2" className="border px-4 py-2 font-bold bg-gray-200">{domain} Domain</td>
      </tr>
    );
    if (groupedLOs[domain]) {
      groupedLOs[domain].forEach((LO) => {
        tableRows.push(
          <tr key={LO._id}>
            <td className="border px-4 py-2 font-semibold">{LO.code}</td>
            <td className="border px-4 py-2">{LO.name}</td>
          </tr>
        );
      });
    }
  });

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold mt-6 mb-2">LOs created for this course</h3>
      <table className="table-auto border-collapse w-full">
        <tbody>
          {tableRows}
        </tbody>
      </table>
    </div>
  );
};

const CompetencesList = ({ course }) => {
  const { categorizedCompetences } = course;

  if (!categorizedCompetences) {
    return null;
  }

  const competences = [
    ...categorizedCompetences.A,
    ...categorizedCompetences.B,
    ...categorizedCompetences.C,
  ];

  if (competences.length === 0) {
    return (
      <div className="mt-4">
        <h3 className="text-lg font-bold mt-6 mb-2">Competences assigned to this course</h3>
        <h5 className="font-bold m-5 text-red-600">No competences assigned to this course!</h5>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold mt-6 mb-2">Competences assigned to this course</h3>
      <table className="table-auto border-collapse w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2">Level</th>
            <th className="border px-4 py-2">Code</th>
            <th className="border px-4 py-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {categorizedCompetences.A.length > 0 && (
            <>
              <tr>
                <td colSpan="3" className="border px-4 py-2 font-bold bg-red-200">Level A</td>
              </tr>
              {categorizedCompetences.A.map((competence) => (
                <tr key={competence._id}>
                  <td className="border px-4 py-2">A</td>
                  <td className="border px-4 py-2 font-semibold">{competence.code}</td>
                  <td className="border px-4 py-2">{competence.description}</td>
                </tr>
              ))}
            </>
          )}
          {categorizedCompetences.B.length > 0 && (
            <>
              <tr>
                <td colSpan="3" className="border px-4 py-2 font-bold bg-red-200">Level B</td>
              </tr>
              {categorizedCompetences.B.map((competence) => (
                <tr key={competence._id}>
                  <td className="border px-4 py-2">B</td>
                  <td className="border px-4 py-2 font-semibold">{competence.code}</td>
                  <td className="border px-4 py-2">{competence.description}</td>
                </tr>
              ))}
            </>
          )}
          {categorizedCompetences.C.length > 0 && (
            <>
              <tr>
                <td colSpan="3" className="border px-4 py-2 font-bold bg-red-200">Level C</td>
              </tr>
              {categorizedCompetences.C.map((competence) => (
                <tr key={competence._id}>
                  <td className="border px-4 py-2">C</td>
                  <td className="border px-4 py-2 font-semibold">{competence.code}</td>
                  <td className="border px-4 py-2">{competence.description}</td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};


//Assessment vs LOs table
const MapAssessmentTable = ({ course, assessments, LOs }) => {
  if (!assessments || !LOs) {
    return <div>Loading Mapping table...</div>;
  }

  console.log("Assessments", assessments);
  console.log("LOs", LOs);

  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr className="bg-indigo-100">
          <th rowSpan={2} className="py-2 border border-gray-300 w-[15%]"
          // style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >Learning Outcomes</th>
          <th colSpan={assessments.length} className="py-2 border border-gray-300 w-[35%]">Assessment Methods</th>
        </tr>
        <tr className="bg-indigo-100">
          {assessments.map(assessment => (
            <th key={assessment._id} className="py-2 px-4 border border-gray-300">{assessment.assessment}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {LOs.map(lo => (
          <tr key={lo._id}>
            <td className="py-2 px-4 border-b border-gray-300">{lo.code}</td>
            {assessments.map(assessment => (
              <td key={assessment._id} className="py-2 border-b border-gray-300 text-center">
                {assessment.LO.some(assessmentLO => assessmentLO._id === lo._id) ? '✓' : ''}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CreateCourse;

