import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { updateField } from "@/components/store/userSlice";

const CreateCourse = ({ cookies }) => {
  const userState = useSelector((s) => s.user);
  const router = useRouter();

  const [mapping, setMapping] = useState({});
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState({});
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

    // const initialMapping = Onecourse.learningOutcomes.reduce((acc, lo) => {
    //   acc[lo._id] = [];
    //   return acc;
    // }, {});

    // console.log("initialMapping", initialMapping);
    // if (!mapping) setMapping(initialMapping);
    // setMapping(initialMapping);

    setMapping([
      {'LO1': []},
      {'LO2': []}
    ]);

    const fetchCompetenceDetails = async (competenceId) => {
      const response = await fetch(`http://localhost:8085/${competenceId}`, {
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
      const competencesDetailsPromises = Onecourse.competences.map(fetchCompetenceDetails);
      const competencesDetails = await Promise.all(competencesDetailsPromises);

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


      setSelectedCourse({
          ...Onecourse,
          categorizedCompetences
      });

    } catch (error) {
      console.error('Error fetching competences:', error);
    }
  };

  const handleCheckboxChange = (loId, competenceId) => {
    console.log("Before change:", mapping);

    setMapping(prevMapping => {
      const updatedMapping = { ...prevMapping };

      if (!Array.isArray(updatedMapping[loId])) {
        updatedMapping[loId] = [];
      }

      if (updatedMapping[loId].includes(competenceId)) {
        updatedMapping[loId] = updatedMapping[loId].filter(id => id !== competenceId);
      } else {
        updatedMapping[loId].push(competenceId);
      }

      console.log("After change:", updatedMapping);
      return updatedMapping;
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("selectedCourse", selectedCourse);
    console.log("mapping", mapping);
  };

  return (
    <div className="flex flex-row min-h-screen mt-5 mb-5">
      <form onSubmit={submitHandler} className="min-h-screen w-screen flex flex-col justify-center items-center text-black">
        <div className="mt-5 w-[70%] flex justify-center min-h-screen">
          <div className="p-20 bg-gray-100 w-full shadow-2xl rounded-3xl">
            <h2 className="font-bold text-form mb-4 text-3xl text-center">Create a Course</h2>
            <div className="flex flex-col gap-4">
              <label htmlFor="title" className="text-form font-bold w-1/3">Course Title:</label>
              <select ref={coursesList} id="small" className="choose-form w-full px-10" onChange={handleCourseChange}>
                <option className="text-left" disabled selected>Choose a Course</option>
                {courses.map((e) => {
                  return <option value={e.id}>{e.name}</option>;
                })}
              </select>
              {<CompetencesCheckboxes
                course={selectedCourse} 
                selectedCourse={selectedCourse} 
              />}
            </div>
            <div className="flex gap-20 mt-10">
              {<div className="w-3/4 mt-10 mx-auto">{msg}</div>}
            </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-6 mt-12 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
            >
              Submit
            </button>
          </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const CompetencesCheckboxes = ({ course }) => {
  const { categorizedCompetences } = course;

  if (!categorizedCompetences) {
    return <div>Loading competences...</div>;
  }

  const competences = [...categorizedCompetences.A, ...categorizedCompetences.B, ...categorizedCompetences.C];
  
  return (
    <div className="flex justify-between gap-20">
    <div className="flex flex-col gap-5 w-full">
    <h4 className="font-semibold ">
        Please mark the competences this faculty aims to achieve:
    </h4>
    <fieldset>
      <legend className="sr-only">Checkboxes</legend>

      <div className="space-y-2">
      {competences.map((el, index) => {
          return (
        <label
          key={index + 1}
          htmlFor={index}
          className="flex cursor-pointer items-start gap-4 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-200 has-[:checked]:bg-blue-50"
        >
          <div className="flex items-center">
            &#8203;
            <input type="checkbox" className="size-4 rounded border-gray-300" id={index} 
            value={el._id}
            data-id={index}
            onChange={handleCheckboxChange}
            />
          </div>

          <div>
            <strong className="font-medium text-gray-900"> {el.code} </strong>

            <p className="mt-1 text-pretty text-medium text-gray-500">
            {el.description}.
            </p>
          </div>
        </label>
          )
        })}
      </div>
    </fieldset>
    </div>
  </div>
  );
}




const MapTable = ({ course, mapping, handleCheckboxChange, selectedCourse }) => {
  const { categorizedCompetences } = course;

  if (!categorizedCompetences) {
     return <div>Loading Mapping table...</div>;
  }
  
  console.log("mapping", mapping)
  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b border-gray-300">Learning Outcomes</th>
          {['A', 'B', 'C'].map(level => (
            categorizedCompetences[level].map(competence => (
              <th key={competence._id} className="py-2 px-4 border-b border-gray-300">{competence.code}</th>
            ))
          ))}
        </tr>
      </thead>
      <tbody>
        {course.learningOutcomes.map(lo => (
          <tr key={lo._id}>
            <td className="py-2 px-4 border-b border-gray-300">{lo.description}</td>
            {['A', 'B', 'C'].map(level => (
              categorizedCompetences[level].map(competence => (
                <td key={competence._id} className="py-2 px-4 border-b border-gray-300">
                  <input
                    type="checkbox"
                    // checked={mapping[lo._id]?.includes(competence._id) || false}
                    onClick={(e) => handleCheckboxChange(lo._id, competence._id)}
                  />
                </td>
              ))
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CreateCourse;
