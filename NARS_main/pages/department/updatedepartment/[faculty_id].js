import { createRef } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useRef, useEffect } from "react";
import React from "react";
import Textarea from "@/components/Textarea/TextareaRoles";
import DropDown from "@/components/form_elements/DropDown";
import { useRouter } from 'next/router';

const updatePorgram = ({ cookies }) => {

  //Check if user is logged in
  const userState = useSelector((s) => s.user);
  if (userState.role != "department admin" || userState.loggedInStatus != "true") {
    return <div className="error">404 could not found</div>;
  }


  const router = useRouter();
  const { faculty_id } = router.query;
  const role = useRef();
  const [competencesChecked, setCompetencesChecked] = useState([]);
  const [msg, setMsg] = useState("");
  const [competences, setcompetences] = useState([]);
  const name = useRef();
  const email = useRef();
  const about = useRef();
  const choosen = useRef();

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

  const closeMsg = () => {
    setMsg("");
  };
  useEffect(() => {
    const fetchCompetence = async () => {
      try {
        const resp = await fetch(`http://localhost:8086/${userState.faculty}/department/${userState.department}/program/${faculty_id}`, {
        headers: {
          Authorization: "Bearer " + userState.token,
        },
      });
      const data = await resp.json();
      console.log("data.data::",data.data);
        
        name.current.value = data.data.program.name
      //   email.current.value = data.data.dean
      //   about.current.value = data.data.about
        

        const response2 = await fetch(`http://localhost:8085/faculty/${userState.faculty}/level/C`, {
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


        setCompetence(competenceData);
      } catch (error) {
        console.error('Error fetching competence:', error);
      }
    };

    if (faculty_id) {
      fetchCompetence();
    }
  }, [faculty_id]);

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

  // const getIdByEmail = async (email) => {
  //   try {
  //     const r = await fetch(`http://localhost:8081/staff?email=${email.current.value}`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //         Authorization: "Bearer " + userState.token,
  //       },
  //     });

  //     const resp = await r.json();
  //     console.log(resp);
  //     if (resp.status == "fail" || resp.status == "error") {
  //       setErr(resp.error.errors.dean.message);
  //       console.log(resp, err);
  //     }
  //     else {
  //       setID(resp.data[0]._id);
  //       console.log(resp, ID);
  //     }

  //   } catch (e) {
  //     console.log(e);
  //   }
  // }


  // const year = useRef();

  // const items = [
  //   "prep",
  //   "first",
  //   "second",
  //   "third",
  //   "fourth",
  //   "fifth",
  //   "sixth",
  // ];

  const submitHandler = async (e) => {
    e.preventDefault();
    // const arr1 = inputs.map((input1) => {
    //   return {
    //     code: input1.ref.current.value,
    //   };
    // });
    // const arr2 = inputs2.map((input2) => {
    //   return {
    //     value: input2.ref.current.value,
    //   };
    // });
    // const competences = arr1.map((a, index) => {
    //   const b = arr2[index];
    //   return {
    //     code: a.code,
    //     description: b.value,
    //   };
    // });
    console.log({
      name: name.current.value,
      // dean: email.current.value,
      // about: about.current.value,
      competences: competencesChecked,
      // academicYears: itemsArr,
    })
    try {
      const r = await fetch(`http://localhost:8086/${userState.faculty}/department/${userState.department}/program/${faculty_id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: name.current.value,
          // dean: email.current.value,
          // about: about.current.value,
          competences: competencesChecked,
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
        Failed to update Program
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
        Program has been updated successfully
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
            <p className="text-3xl font-bold text-blue-800 mb-6 mt-4">Update Program</p>
            <div className="flex justify-between gap-20">
              <div className="flex flex-col gap-5 w-2/5">
                <div className="font-semibold">Program Name:</div>
                <input
                  required
                  type="text"
                  name="name"
                  placeholder="Program name"
                  className="input-form w-full"
                  ref={name}
                />
              </div>
              {/* <div className="flex flex-col gap-5  w-2/5">
                <div> Dean email:</div>
                <input
                  required
                  type="email"
                  name="year"
                  className="input-form  w-full"
                  ref={email}
                  // onBlur={() => getIdByEmail(email)}
                />
              </div> */}
            </div>
            
            
            {/* <div className="flex gap-20">
              <div className="flex flex-col gap-5 w-full">
                <div>About:</div>
                <textarea
                  required
                  className="w-full input-form"
                  rows="4"
                  placeholder="Type here  about the faculty"
                  ref={about}
                />
              </div>
            </div> */}

<CompetenceList competences={competences} handleCheckboxChange={handleCheckboxChange}/>

              
            <div className="flex gap-20 ">
              {<div className="w-1/2 mt-10">{msg}</div>}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                class="w-[6rem]  text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm md:text-lg px-5 py-2.5 mx-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

const CompetenceList = ({ competences, handleCheckboxChange }) => {

  console.log("Competences from CompetenceList: ", competences)

  if (competences.length == 0) {
    return (
      <div className="flex flex-col gap-5 w-full">
        <h4 className="font-semibold text-xl"> 
            Please mark the competences this faculty aims to achieve:
        </h4>
        <p className="text-red-500 font-semibold text-lg ml-5">No competences found for this faculty</p>
      </div>
    );
  }

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
  )
}
export default updatePorgram;
