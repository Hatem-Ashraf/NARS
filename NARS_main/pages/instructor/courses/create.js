import { useEffect, useState, useRef, createRef  } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { updateField } from "@/components/store/userSlice";

const CreateCourse = ({ cookies }) => {
  const userState = useSelector((s) => s.user);
  const router = useRouter();

  //Some rendering hooks
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  //New states
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: "Cryptography and Information Security",
      code: "CCE506",
      hours: "",
      information: "",
      aims: "",
    },
  ]);
  const [selectedCourse, setSelectedCourse] = useState({});
  const [coursesCompetences, setCoursesCompetences] = useState([{
        code: "A.1",
        descritopn: "Some description about this competence",
        level: "A"
      },
      {
        code: "B.3",
        descritopn: "Some description about this competence",
        level: "B"
      },
      {
        code: "C.2",
        descritopn: "Some description about this competence",
        level: "C"
      }
    ]);
  
  const coursesList = useRef();


  //Fetging all the assined corsesd 
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



  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedCourse((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
  
    // Function to fetch competence details
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
    } catch (error) {
      console.error('Error fetching competences:', error);
    }
  };
  
  const submitHandler = async (e) => {
    e.preventDefault();

    console.log("selectedCourse", selectedCourse)
    console.log({
      name: selectedCourse.name,
      code: selectedCourse.code,
      // qualityCompetencies: selectedCourse.competences,
      courseAims: selectedCourse.courseAims,
      courseInformation: selectedCourse.courseInformation,
    })

    if (selectedCourse) {
      const response = await fetch(`http://localhost:8087/newCourse/${selectedCourse._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userState.token,
        },
        body: JSON.stringify({
          name: selectedCourse.name,
          code: selectedCourse.code,
          // qualityCompetencies: selectedCourse.competences,
          courseAims: selectedCourse.courseAims,
          courseInformation: selectedCourse.courseInformation,
        }),
      });

      const data = await response.json();

      if (response.status == "fail") {
        // setErr(resp.error.errors.dean.message);
        setMsg(fail);
      }
      else {
        setMsg(success);
      }

    } else {
      alert("Please fill form")
      return
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
        Failed to Submit Course
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
        Course has been Submitted successfully
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
      <form onSubmit={submitHandler}
        className=" min-h-screen w-screen flex flex-col justify-center items-center text-black"
      >
      <div className="mt-5 w-[70%] flex justify-center min-h-screen">
      <div className=" p-20 bg-gray-100 w-full shadow-2xl rounded-3xl">
        <h2 className="font-bold text-form mb-4 text-3xl text-center">Create a Course</h2>
          <div className="flex flex-col gap-4 ">
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
            

            <label htmlFor="code" className="text-form font-bold">
              Course Code:
            </label>
            <input
              placeholder="Course Code"
              type="text"
              id="code"
              name="code"
              value={selectedCourse.code}
              onChange={handleChange}
              className="input-field border-1 border-gray-800"
            />

            <label htmlFor="aims" className="text-form font-bold">
            Course Aims:
            </label>
            <textarea
            placeholder="Course Aims"
              id="courseAims"
              name="courseAims"
              value={selectedCourse.courseAims}
              onChange={handleChange}
              className="input-field border-1 border-gray-800"
              rows="4"
            ></textarea>

            <label htmlFor="information" className="text-form font-bold">
            Course Information:
            </label>
            <textarea
              placeholder="Course Information"
              id="courseInformation"
              name="courseInformation"
              value={selectedCourse.courseInformation}
              onChange={handleChange}
              className="input-field border-1 border-gray-800"
              rows="4"
            ></textarea>

        {/* {selectedCourse && <CourseDetails course={selectedCourse} />} */}

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

const CourseDetails = ({ course }) => {
  const { categorizedCompetences } = course;

  if (!categorizedCompetences) {
    return <div>Loading competences...</div>;
  }

  return (
    <div className="mt-4 ">
      <h3 className="text-lg font-bold mt-6 mb-2">Learning Outcomes (LO’s)</h3>

      <div className="mb-4">
        <h4 className="text-md font-semibold bg-red-200">Level A</h4>
        <ul className="list-inside ml-5 ">
          {categorizedCompetences.A.map((competence) => (
            <li key={competence._id}><span className="font-semibold">{competence.code}</span> - {competence.description}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h4 className="text-md font-semibold bg-red-200">Level B</h4>
        <ul className="list-inside ml-5 ">
          {categorizedCompetences.B.map((competence) => (
            <li key={competence._id}><span className="font-semibold">{competence.code}</span> - {competence.description}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h4 className="text-md font-semibold bg-red-200">Level C</h4>
        <ul className="list-inside ml-5 ">
          {categorizedCompetences.C.map((competence) => (
            <li key={competence._id}><span className="font-semibold">{competence.code} </span>- {competence.description}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};



export default CreateCourse;
