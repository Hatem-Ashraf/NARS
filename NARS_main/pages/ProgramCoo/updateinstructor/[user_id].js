import { createRef } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useRef, useEffect } from "react";
import React from "react";
import Textarea from "@/components/Textarea/TextareaRoles";
import DropDown from "@/components/form_elements/DropDown";
import { useRouter } from 'next/router';

const addfaculty = ({ cookies }) => {

  //Check if user is logged in
  const userState = useSelector((s) => s.user);
  // if (userState.role != "program admin" || userState.loggedInStatus != "true") {
  //   return <div className="error">404 could not found</div>;
  // }


  const router = useRouter();
  const { user_id } = router.query;
  const role = useRef();
  const [competencesChecked, setCompetencesChecked] = useState([]);
  const [msg, setMsg] = useState("");
  const [competences, setcompetences] = useState([]);
  const name = useRef();
  const email = useRef();
  const about = useRef();
  const choosen = useRef();

  // async function getCreatedCoursesForInstructor() {
  //   const data = await fetch(
  //     `http://localhost:8087/original-courses?program=${userState.program}`,
  //     {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //         Authorization: "Bearer " + userState.token,
  //       },
  //     }
  //   );

  //   const resp = await data.json();

  //   console.log(resp);

  //   sC(resp.data);
  // }
  const navStatus = useSelector((s) => s.user.navStatus);

  const handelFile = () => {
    myFileInput.current.click();
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


  const [competence, setCompetence] = useState(competences); // Define setCompetence here
  const closeMsg = () => {
    setMsg("");
  };
  useEffect(() => {
    const fetchCompetence = async () => {
      try {
        const response = await fetch(`http://localhost:8081/staff/${user_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + userState.token,
          },
        });
  
        const data = await response.json();
        console.log("res Data:", data);
  
        name.current.value = data.data.name;
        email.current.value = data.data.email;
  
        const response2 = await fetch(`http://localhost:8087/newCourse`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + userState.token,
          },
        });
  
        const data2 = await response2.json();
        console.log("data2.competences", data2.data);
        setcompetences(data2.data);
      } catch (error) {
        console.error('Error fetching competence:', error);
      }
    };
  
    if (user_id) {
      fetchCompetence();
    }
  }, [user_id]);


  const [inputs, setInputs] = useState([]);
  const [inputs2, setInputs2] = useState([]);
  const handleAddInput = (e) => {
    e.preventDefault();

    setInputs([
      ...inputs,
      {
        ref: createRef(),
      },
    ]);

    setInputs2([
      ...inputs2,
      {
        ref: createRef(),
      },
    ]);
  };
  const removeLO1 = (e, input2, input) => {
    e.preventDefault();
    setInputs2(
      inputs2.filter((e) => {
        return e != input2;
      })
    );
    setInputs(
      inputs.filter((e) => {
        return e != input;
      })
    );
  };
  const [err, setErr] = useState("");
  const [itemsArr, setItems] = useState([]);
  const [ID, setID] = useState("")
  const handleSelectChange = (year) => {
    itemsArr.push(year.current.value);
    choosen.current.value = itemsArr.map((e) => {
      return e;
    });

    console.log(itemsArr);
  };
  const handleReset = (e) => {
    e.preventDefault();
    itemsArr.length = 0;
    choosen.current.value = itemsArr.map((e) => {
      return e;
    });
    console.log(itemsArr);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log({
      instructorId: user_id,
      courseIds: competencesChecked,
      // academicYears: itemsArr,
    })
    
    try {
      const r = await fetch(`http://localhost:8087/assign-course-instructor`, {
        method: "PATCH",
        body: JSON.stringify({
          instructorId: user_id,
          courseIds: competencesChecked,
          // academicYears: itemsArr,
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + userState.token,
        },
      });

      const resp = await r.json();
      console.log(resp);
      console.log(itemsArr);
      if (resp.status == "fail" || resp.status == "error") {
        // setErr(resp.error.errors.dean.message);
        console.log(resp);
        setMsg(fail);
      }
      else {
        console.log(resp);
        setMsg(success);
      }
    } catch (e) {
      console.log(e);
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
        Failed to assign Instructor
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
        Instructor has been assigned successfully
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
    <>
      <div className="flex flex-row h-screen mt-5 mb-5">
        <form
          onSubmit={submitHandler}
          className=" h-screen w-screen flex flex-col justify-center items-center text-black"
        >
          <div className="contentAddUser2 flex flex-col gap-10 overflow-auto">
            <p className="font-normal">Instructor {">"} Assign Instructor</p>
            <div className="flex justify-between gap-20">
              <div className="flex flex-col gap-5 w-2/5">
                <div>Instructor Name:</div>
                <input
                  required
                  type="text"
                  name="name"
                  className="input-form w-full"
                  ref={name}
                  readOnly
                  style={{ color: 'gray' }}
                />
              </div>
              <div className="flex flex-col gap-5  w-2/5">
                <div> Instructor email:</div>
                <input
                  required
                  type="email"
                  name="year"
                  className="input-form  w-full"
                  ref={email}
                  readOnly
                  style={{ color: 'gray' }}
                />
              </div>
            </div>

            <div className="flex justify-between gap-20">
              <div className="flex flex-col gap-5 w-full">
              <label for="country" class="block text-xl font-medium leading-6 text-gray-900">Courses</label>
              <fieldset>
                <legend className="sr-only">Checkboxes</legend>
                  <div className="space-y-2">
                    {competences && competences.map((el, index) => (
                      <label
                        key={index + 1}
                        htmlFor={index}
                        className="flex cursor-pointer items-start gap-4 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-200 has-[:checked]:bg-blue-50"
                      >
                        <div className="flex items-center">
                          &#8203;
                          <input
                            type="checkbox"
                            className="size-4 rounded border-gray-300"
                            id={index} 
                            value={el._id}
                            data-id={index}
                            onChange={handleCheckboxChange}
                          />
                        </div>

                        <div>
                          <strong className="font-medium text-gray-900">{el.code}</strong>
                          <p className="mt-1 text-pretty text-medium text-gray-500">
                            {el.name}.
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
              </fieldset>
              </div>
            </div>
              
            <div className="flex gap-20 ">
              {<div className="w-1/2 mt-10">{msg}</div>}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                class="w-[6rem]  text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm md:text-lg px-5 py-2.5 mx-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Assign
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
export default addfaculty;
