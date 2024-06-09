import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import UserCard from "@/components/user/UserCard";
import CompetencesList from "@/components/ProgramQuality/competences";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";

const competences = ({ cookies }) => {
  const userState = useSelector((s) => s.user);
  const router = useRouter();

  const [selectedCourse, setSelectedCourse] = useState({});
  const [A_competences, setA_competences] = useState([]);
  const [B_competences, setB_competences] = useState([]);
  const [C_competences, setC_competences] = useState([]);
  
  const coursesList = useRef();
  const [courses, setCourses] = useState([]);
  const [competencesChecked, setCompetencesChecked] = useState([]);
  const [msg, setMsg] = useState("");




  useEffect(() => {
    async function getCourses() {
        const d = await fetch(`http://localhost:8087/newCourse/faculty/${userState.faculty}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + cookies.token,
          },
        });
  
        const data = await d.json();
        // let a = data.data.map((e) => {
        //   return { name: e.name, id: e._id, code: e.code };
        // });
        console.log("courses from server:",  data.data);
        setCourses(data.data);
      }
      getCourses();

    facultyComp();
    departmentComp();
    programComp();
  }, []);

  const closeMsg = () => {
    setMsg("");
  };

  const facultyComp = async () => {
    try {
        const resp = await fetch(`http://localhost:8085/faculty/${userState.faculty}/level/A`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: "Bearer " + userState.token,
            },
        });
      const data = await resp.json();
      console.log("data.competences", data.data);
      setA_competences(data.data);
    } catch (e) {
      console.log(e);
    }
  };
  const departmentComp = async () => {
    try {
        const resp = await fetch(`http://localhost:8085/faculty/${userState.faculty}/level/B`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: "Bearer " + userState.token,
            },
        });
      const data = await resp.json();
      console.log("data.competences", data.data);
      setB_competences(data.data);
    } catch (e) {
      console.log(e);
    }
  };
  const programComp = async () => {
    try {
        const resp = await fetch(`http://localhost:8085/faculty/${userState.faculty}/level/C`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: "Bearer " + userState.token,
            },
        });
      const data = await resp.json();
      console.log("data.competences", data.data);
      setC_competences(data.data);
    } catch (e) {
      console.log(e);
    }
  };
  const submitHandler = async (e) => {
    e.preventDefault();

    if (coursesList.current.value === "no") {
      alert("Please select a course");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8087/newCourse/${coursesList.current.value}`, {
        method: "PATCH",
        body: JSON.stringify({
          competences: competencesChecked
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userState.token}`,
        },
      });
      const data = await response.json();
      console.log("Response : ", data);

      if (data.status == "fail" || data.status == "error") {
        // setErr(resp.error.errors.dean.message);
        console.log(data);
        setMsg(fail);
      } else {
        console.log(data);
        setMsg(success);
        //redirect after 2 seconds
        setTimeout(() => {
          router.push("http://localhost:3000/profile");
        }, 1500)
      }

      
    } catch (error) {
      console.error("Error assigning competences for this course : ", error);
    }
  };

  const handleCheckboxChange = (event) => {
    console.log("competencesChecked: ", competencesChecked)

    const updatedList = [...competencesChecked]; // Create a copy of the existing competencesChecked array
    const checkboxValue = event.target.value; // Get the value of the checkbox

    if (event.target.checked) {
      updatedList.push(checkboxValue); // Add the checkbox value to the updatedList array
    } else {
      const indexToRemove = updatedList.indexOf(checkboxValue);
      updatedList.splice(indexToRemove, 1); // Remove the checkbox value from the updatedList array
    }

    setCompetencesChecked(updatedList); // Update the competencesChecked state with the updatedList array
    console.log("miniinin1", updatedList);
  };

  let fail = (
    <div
      id="alert-border-2"
      class="flex p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800"
      role="alert"
    >
      <i class="fa-sharp fa-solid fa-circle-exclamation"></i>
      <div class="ml-3 text-lg font-medium">
        Failed to Submit Course Competences
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
        Course Competences has been Submitted successfully
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


  const handleCourseChange = async () => {
    const selectedcourseId = coursesList.current.value;
    console.log("selectedFcourseId: ", selectedcourseId);


    try {
      let tempArray = [];

    const resp = await fetch(
      `http://localhost:8087/newCourse/${selectedcourseId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userState.token,
        },
      }
    );

    const data = await resp.json();
    
    if(!data.data) return

    const Onecourse = data.data;

    console.log("Course details from server after select change :", Onecourse);
    setTimeout(() => {
      setSelectedCourse(Onecourse);
    }, 500);
  } catch (err)  {
    console.error(err);
   }
  };


  return (
    <>
        <div className="min-h-screen mx-auto contentAddUser3 overflow-y-hidden w-full flex flex-col gap-10">
          <div className=" min-h-screen m-auto flex w-full justify-center p-5 "  >
            <div className="w-full p-8 rounded-lg" >
            <h1 className="text-4xl font-bold text-center mb-6 mt-4 text-indigo-600">Add Course Competences</h1>
              <form 
                onSubmit={submitHandler}
              >
                <label htmlFor="title" className="text-form font-bold w-1/3">Choose a Course:</label>
                    <select
                        ref={coursesList}
                        id="small"
                        class="choose-form w-full px-10 shadow-lg"
                        onChange={handleCourseChange}
                    >
                        <option value="no" className="text-left" disabled selected>
                        Choose a Course
                        </option>
                        {courses.map((e) => {
                        return <option value={e._id}>{`${e.code} - ${e.name}`}</option>;
                        })}{" "}
                    </select>
            <div className="mt-10">
                <h3 className="text-3xl font-bold text-center mb-6 mt-4 text-indigo-600">Level A Competences</h3>
                {A_competences.length > 0 ? (
                    <>
                    <h2 className="text-xl font-semibold mb-2">Competence List {`[A]`}</h2>
                    <CompetenceList 
                      competences={A_competences} 
                      handleCheckboxChange={handleCheckboxChange}
                      offset={0}
                    />
                    </>
                ) : (
                    <div className="text-center text-lg">No competences found</div>
                )}
            </div>
            <div className="mt-10">
                <h3 className="text-3xl font-bold text-center mb-6 mt-4 text-indigo-600">Level B Competences</h3>
                {A_competences.length > 0 ? (
                    <>
                    <h2 className="text-xl font-semibold mb-2">Competence List {`[B]`}</h2>
                    <CompetenceList 
                      competences={B_competences} 
                      handleCheckboxChange={handleCheckboxChange}
                      offset={A_competences.length}
                    />

                    </>
                ) : (
                    <div className="text-center text-lg">No competences found</div>
                )}
            </div>
            <div className="mt-10">
                <h3 className="text-3xl font-bold text-center mb-6 mt-4 text-indigo-600">Level C Competences</h3>
                {A_competences.length > 0 ? (
                    <>
                    <h2 className="text-xl font-semibold mb-2">Competence List {`[C]`}</h2>

                    <CompetenceList 
                      competences={C_competences} 
                      handleCheckboxChange={handleCheckboxChange}
                      offset={B_competences.length + A_competences.length}
                    />

                    </>
                ) : (
                    <div className="text-center text-lg">No competences found</div>
                )}
            </div>

            <div className="flex gap-20 mt-10">
              {<div className="w-3/4 mt-10 mx-auto">{msg}</div>}
            </div>
                
            <div className="flex justify-end mt-10">
              <button
                type="submit"
                class="w-[15rem] text-white bg-blue-700 hover:bg-blue-800 ring-4 ring-blue-800 font-medium rounded-lg text-sm md:text-lg px-5 py-2.5 mx-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Assign Competences
              </button>
            </div>
            </form>
            </div>
          </div>
        </div>
    </>
  );
};

const CompetenceList = ({ competences, handleCheckboxChange, offset }) => {

  console.log("Competences from CompetenceList: ", competences)

  if (competences.length == 0) {
    return (
      <div className="flex flex-col gap-5 w-full">
        <p className="text-red-500 font-semibold text-lg ml-5">No competences found</p>
      </div>
    );
  }

  return (
    <div className="flex justify-between gap-20">
    <div className="flex flex-col gap-5 w-full">
    <fieldset>
      <legend className="sr-only">Checkboxes</legend>

      <div className="space-y-2">
      {competences.map((el, index) => {
          return (
        <label
          key={index + offset + 1}
          htmlFor={index + offset}
          className="flex cursor-pointer items-start gap-4 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-200 has-[:checked]:bg-blue-50"
        >
          <div className="flex items-center">
            &#8203;
            <input type="checkbox" className="size-4 rounded border-gray-300" id={index + offset} 
            value={el._id}
            data-id={index + offset}
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
  )
}

export default competences;
