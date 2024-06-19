import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { updateField } from "@/components/store/userSlice";

const CreateCourse = ({ cookies }) => {
  const userState = useSelector((s) => s.user);
  const router = useRouter();

  const [courseLOs, setCourseLOs] = useState([]);
  const [courseAssesments, setCourseAssesments] = useState([]);
  const [courseTopics, setCourseTopics] = useState([]);
  const [mapping, setMapping] = useState({});
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
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

  const handleCourseChange = async () => {
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
      // Fetch all competence details
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
      console.error('Error fetching competences:', error);
    }
  };

  // const handleCheckboxChange = (loId, competenceId) => {
  //   console.log("Before change:", mapping);

  //   setMapping(prevMapping => {
  //     const updatedMapping = { ...prevMapping };

  //     if (!Array.isArray(updatedMapping[loId])) {
  //       updatedMapping[loId] = [];
  //     }

  //     if (updatedMapping[loId].includes(competenceId)) {
  //       updatedMapping[loId] = updatedMapping[loId].filter(id => id !== competenceId);
  //     } else {
  //       updatedMapping[loId].push(competenceId);
  //     }

  //     console.log("After change:", updatedMapping);
  //     return updatedMapping;
  //   });
  // };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("selectedCourse", selectedCourse);
    console.log("mapping", mapping);
  };

  return (
    <div className="flex flex-row min-h-screen mt-5 mb-5">
      <form onSubmit={submitHandler} className="min-h-screen w-screen flex flex-col justify-center items-center text-black">
        <div className="mt-5 w-[80%] flex justify-center min-h-screen">
          <div className="p-20 bg-gray-100 w-full shadow-2xl rounded-3xl">
            <h2 className="font-bold text-form mb-4 text-3xl text-center">Course Specs</h2>
            <div className="flex flex-col gap-4">
              <label htmlFor="title" className="text-form font-bold w-1/3">Course Title:</label>
              <select ref={coursesList} id="small" className="choose-form w-full px-10" onChange={handleCourseChange}>
                <option className="text-left" disabled selected>Choose a Course</option>
                {courses.map((e) => {
                  return <option value={e.id}>{e.name}</option>;
                })}
              </select>
              { selectedCourse && 
                <>
                <CompetenceTable 
                  course={selectedCourse} mapping={mapping} LOs={courseLOs}
                  selectedCourse={selectedCourse} 
                />

                <MapAssessmentTable
                  course={selectedCourse} mapping={mapping} LOs={courseLOs} 
                  assessments={courseAssesments}
                  selectedCourse={selectedCourse} 
                />
                <TopicsTable 
                course={selectedCourse}
                LOs={courseLOs}
                topics={courseTopics}
                />
              </>
              }
            </div>
            <div className="flex gap-20 mt-10">
              {<div className="w-3/4 mt-10 mx-auto">{msg}</div>}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const CompetenceTable = ({ course, LOs }) => {
  const { categorizedCompetences } = course;

  if (!categorizedCompetences) {
    return <div>Loading Mapping table...</div>;
  }

  console.log("LOs", LOs)
  return (
    <table className="min-w-full mb-20 mt-20 bg-white">
      <thead>
        <tr className="bg-gray-200">
        <th rowSpan={2} className="py-2 border border-gray-300 w-[10%]">Learning Outcomes</th>
        <th colSpan={course.competences.length} className="py-2 border border-gray-300 w-[15%]">Competences</th>

        </tr>
        <tr className="bg-gray-200">
          {['A', 'B', 'C'].map(level => (
            categorizedCompetences[level].map(competence => (
              <th key={competence._id} className="py-2 px-4 border border-gray-300">{competence.code}</th>
            ))
          ))}
        </tr>
      </thead>
      <tbody>
        {LOs.map(lo => (
          <tr key={lo._id}>
            <td className="py-2 px-4 border-b border-gray-300 ">{lo.code}</td>
            {['A', 'B', 'C'].map(level => (
              categorizedCompetences[level].map(competence => (
                <td key={competence._id} className="py-2 border-b border-gray-300 text-center">
                  {lo.competencies?.includes(competence._id) ? '✓' : ''}
                </td>
              ))
            ))}
          </tr>
        ))}
      </tbody>
    </table>
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


const TopicsTable = ({ course, topics, LOs }) => {
  const { categorizedCompetences } = course;

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




export default CreateCourse;
