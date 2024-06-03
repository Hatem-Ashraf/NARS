import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { updateField } from "@/components/store/userSlice";

const CreateCourse = ({ cookies }) => {
  const userState = useSelector((s) => s.user);
  const router = useRouter();

  const [mapping, setMapping] = useState({});
  const [competencesChecked, setCompetencesChecked] = useState([]);
  const [courseLOs, setCourseLOs] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  const coursesList = useRef();
  const seletedLO = useRef();
  useEffect(() => {
    async function getCoursesAndLOs() {
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

    getCoursesAndLOs();
  }, []);

  const closeMsg = () => {
    setMsg("");
  };

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
      } else {
        throw new Error('Failed to fetch LOs for this course');
      }

    } catch (error) {
      console.error('Error fetching competences:', error);
    }
  };

  const handleLoChange = (event) => {
    const selectedLO = event.target.value;
    console.log("selectedLO", selectedLO);
  };

  const handleCheckboxChange = (event) => {
    const updatedList = [...competencesChecked]; // Create a copy of the existing competencesChecked array
    const checkboxValue = event.target.value; // Get the value of the checkbox

    if (event.target.checked) {
      updatedList.push(checkboxValue); // Add the checkbox value to the updatedList array
    } else {
      const indexToRemove = updatedList.indexOf(checkboxValue);
      updatedList.splice(indexToRemove, 1); // Remove the checkbox value from the updatedList array
    }

    setCompetencesChecked(updatedList); // Update the competencesChecked state with the updatedList array
    console.log("competences checked ! :", updatedList);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (selectedCourse == null) {
      alert("Please select a course")
      return ;
    }
    
    if (seletedLO.current.value == 'Choose LO'){
      alert("Please select a LO")
      return ;
    }

    console.log("selectedCourse", selectedCourse);
    console.log("selteced LO", seletedLO.current.value);
    console.log("compenteces", competencesChecked);


    try {
      const response = await fetch(`http://localhost:8087/los/${seletedLO.current.value}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
      body: JSON.stringify({
        competencies: competencesChecked
    })
    });

    const data = await response.json();
    console.log("data", data);

    if (data.status == "success") {
      console.log("Course created successfully.");
      setMsg(success)
    }else {
      setMsg(fail)
      throw new Error(data.message || "Failed to create course.");
    }

  } catch (err) {
    console.error(err);
  }

  };

  let fail = (
    <div
      id="alert-border-2"
      class="flex p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800"
      role="alert"
    >
      <i class="fa-sharp fa-solid fa-circle-exclamation"></i>
      <div class="ml-3 text-lg font-medium">
        Failed to create Mapping
        <a href="#" class="font-semibold underline hover:no-underline"></a>.
      </div>
      <button
        type="button"
        onClick={closeMsg}
        class="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
        data-dismiss-target="#alert-border-2"
        aria-label="Close"
      >
        <span class="sr-only">Dismiss</span>
        <svg
          aria-hidden="true"
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  );

  let success = (
    <div
      id="alert-border-3"
      class="flex p-4 mb-4 text-green-800 border-t-4 border-green-300 bg-green-50 dark:text-green-400 dark:bg-gray-800 dark:border-green-800"
      role="alert"
    >
      <i class="fa-solid fa-circle-check"></i>
      <div class="ml-3 text-lg font-medium">
        Mapping has been Submitted successfully
        <a href="#" class="font-semibold underline hover:no-underline"></a>
      </div>
      <button
        onClick={closeMsg}
        type="button"
        class="ml-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
        data-dismiss-target="#alert-border-3"
        aria-label="Close"
      >
        <span class="sr-only">Dismiss</span>
        <svg
          aria-hidden="true"
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  );

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

              <label htmlFor="title" className="text-form font-bold w-1/3">Learning outcome:</label>
              <select disabled={selectedCourse === null} ref={seletedLO} id="small2" className="choose-form w-full px-10" onChange={handleLoChange} >
                <option className="text-left" disabled selected>Choose LO</option>
                {courseLOs.map((e) => {
                  return (
                    <option value={e._id}>
                        {e.code} - {e.name.length > 40 ? `${e.name.substring(0, 40)}...` : e.name}
                    </option>
                  );                })}
              </select>

              { selectedCourse && <CompetencesCheckboxes
                course={selectedCourse} 
                handleCheckboxChange={handleCheckboxChange}
                selectedLO={seletedLO.current.value}
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

const CompetencesCheckboxes = ({ course, handleCheckboxChange, selectedLO }) => {
  const { categorizedCompetences } = course;

  if (course.competences.length == 0) {
    return <div className="font-semibold text-lg m-5">No competences assgined to this course!</div>;
  }


  const competences = [...categorizedCompetences.A, ...categorizedCompetences.B, ...categorizedCompetences.C];
  
  return (
    <div className="flex justify-between gap-20">
    <div className="flex flex-col gap-5 w-full">
    <h4 className="font-semibold ">
        Please mark the competences this LO aims to achieve:
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


export default CreateCourse;
