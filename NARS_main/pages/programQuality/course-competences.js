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
  const [A_competences, setA_competences] = useState([]);
  const [B_competences, setB_competences] = useState([]);
  const [C_competences, setC_competences] = useState([]);
  
  const coursesList = useRef();
  const [courses, setCourses] = useState([]);
  const [competencesChecked, setCompetencesChecked] = useState([]);



  useEffect(() => {
    async function getCourses() {
        const d = await fetch(`http://localhost:8087/original-courses`, {
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
        console.log("courses from server:",  data);
        setCourses([
            {
                name: "course 1",
                id: "1",
                code: "EC1",
            },
            {
                name: "course 2",
                id: "2",
                code: "EC2",
            }
        ]);
      }
      getCourses();

    facultyComp();
    departmentComp();
    programComp();
  }, []);

  const facultyComp = async () => {
    try {
        const resp = await fetch(`http://localhost:8085/facultyComp`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: "Bearer " + userState.token,
            },
        });
      const data = await resp.json();
      console.log("data.competences", data.competences);
      setA_competences(data.competences);
    } catch (e) {
      console.log(e);
    }
  };
  const departmentComp = async () => {
    try {
        const resp = await fetch(`http://localhost:8085/departmentComp`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: "Bearer " + userState.token,
            },
        });
      const data = await resp.json();
      console.log("data.competences", data.competences);
      setB_competences(data.competences);
    } catch (e) {
      console.log(e);
    }
  };
  const programComp = async () => {
    try {
        const resp = await fetch(`http://localhost:8085/programComp`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: "Bearer " + userState.token,
            },
        });
      const data = await resp.json();
      console.log("data.competences", data.competences);
      setC_competences(data.competences);
    } catch (e) {
      console.log(e);
    }
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    // try {
    //   const response = await fetch("http://localhost:8087/created-courses", {
    //     method: "POST",
    //     body: JSON.stringify(courseData),
    //     headers: {
    //       "Content-Type": "application/json",
    //       Accept: "application/json",
    //       Authorization: `Bearer ${userState.token}`,
    //     },
    //   });
    //   const data = await response.json();
    //   console.log(data);
    //   // Optionally, redirect the user to another page after successful submission
    //   router.push("/dashboard"); // Change "/dashboard" to the appropriate route
    // } catch (error) {
    //   console.error("Error creating course: ", error);
    // }
    if (coursesList.current.value === "no") {
      alert("Please select a course");
      return;
    }
    console.log({
        course: coursesList.current.value,
        competencesChecked: competencesChecked
       })
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
    console.log("miniinin1", updatedList);
  };

  const handleCourseChange = async () => {
    const selectedFacultyId = coursesList.current.value;
    console.log(selectedFacultyId);


    let tempArray = [];

    const resp = await fetch(
      `http://localhost:8087/original-courses/${selectedFacultyId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userState.token,
        },
      }
    );

    const data = await resp.json();
    
    if(!data.data) return

    const Onecourse = data.data;

    console.log("Course details from server:", Onecourse);
    setTimeout(() => {
      setSelectedCourse(Onecourse);
    }, 500);
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
                        return <option value={e.id}>{`${e.code} - ${e.name}`}</option>;
                        })}{" "}
                    </select>
            <div className="mt-10">
                <h3 className="text-3xl font-bold text-center mb-6 mt-4 text-indigo-600">Level A Competences</h3>
                {A_competences.length > 0 ? (
                    <>
                    <h2 className="text-xl font-semibold mb-2">Competence List {`[A]`}</h2>
                    <CompetencesList 
                    competences={A_competences}
                    //   setCompetences={setFilteredcompetences}
                    level="level-A"
                    delete_url="http://localhost:8085/deleteFacultyComp/"
                    create_file_name="AddLevelA"
                    handleCheckboxChange={handleCheckboxChange}
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
                    <CompetencesList 
                    competences={B_competences}
                    //   setCompetences={setFilteredcompetences}
                    level="level-B"
                    delete_url="http://localhost:8085/deleteFacultyComp/"
                    create_file_name="AddLevelA"
                    handleCheckboxChange={handleCheckboxChange}
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
                    <CompetencesList 
                    competences={C_competences}
                    //   setCompetences={setFilteredcompetences}
                    level="level-C"
                    delete_url="http://localhost:8085/deleteFacultyComp/"
                    create_file_name="AddLevelA"
                    handleCheckboxChange={handleCheckboxChange}
                    />
                    </>
                ) : (
                    <div className="text-center text-lg">No competences found</div>
                )}
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

export default competences;
