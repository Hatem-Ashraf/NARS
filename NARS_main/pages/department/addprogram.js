import { createRef } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useRef, useEffect } from "react";
import React from "react";
import Textarea from "@/components/Textarea/TextareaRoles";
import DropDown from "@/components/form_elements/DropDown"
const addDepartment = ({ cookies }) => {
  const userState = useSelector((s) => s.user);
  if (userState.role != "department admin" || userState.loggedInStatus != "true") {
    return <div className="error">404 could not found</div>;
  }

  const role = useRef();
  const [competencesChecked, setCompetencesChecked] = useState([]);
  const [msg, setMsg] = useState("");
  const [competences, setcompetences] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});


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
    const fetchData = async () => {
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
          setcompetences(data.data);
          // setFilteredcompetences(data.competences);
        } catch (e) {
          console.log(e);
        }
    };

    fetchData();

    // Clean-up function if needed
    return () => {
      // Any clean-up code if required
    };
  }, []); // Empty dependency array ensures effect runs only once on mount
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

  const name = useRef();
  const email = useRef();
  const about = useRef();
  const mission = useRef();
  const vision = useRef();
  const year = useRef();

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log({
      name: name.current.value,
      mission: mission.current.value,
      vision: vision.current.value,
      // dean: email.current.value,
      // about: about.current.value,
      competences: competencesChecked,
    })
    try {
      console.log({
        name: name.current.value,
        mission: mission.current.value,
        vision: vision.current.value,
        // dean: email.current.value,
        // about: about.current.value,
        competences: competencesChecked,
      })
      const r = await fetch(`http://localhost:8086/${userState.faculty}/department/${userState.department}`, {
        method: "POST",
        body: JSON.stringify({
          name: name.current.value,
          mission: mission.current.value,
          vision: vision.current.value,
          // dean: email.current.value,
          // about: about.current.value,
          competences: competencesChecked,
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
        setErr(resp.error.errors.dean.message);
        console.log(resp, err);
        setMsg(fail);
      }
      else {
        setMsg(success);
        console.log(resp);
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
        Failed to create Program
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
        Program has been Created successfully
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
      <div className="flex flex-row min-h-screen mt-5 mb-5">
        <form
          onSubmit={submitHandler}
          className=" min-h-screen w-screen flex flex-col justify-center items-center text-black"
        >
          <div className="contentAddUser2 flex flex-col gap-10 overflow-auto">
            <p className="text-3xl font-bold text-blue-800 mb-6 mt-4">Add Program</p>
            <div className="flex justify-between gap-20">
              <div className="flex flex-col gap-5 w-3/5">
                <div className="font-semibold">Program Name:</div>
                <input
                  required
                  type="text"
                  name="name"
                  className="input-form w-full"
                  placeholder="Program name"
                  ref={name}
                />
              </div>
            </div>

            <div className="flex justify-between gap-20">
              <div className="flex flex-col gap-5 w-3/6">
                <div className="font-semibold">Vision :</div>
                <textarea
                  required
                  className="w-full input-form"
                  rows="4"
                  placeholder="Type here  about the vision"
                  ref={vision}
                />
              </div>
              <div className="flex flex-col gap-5  w-3/6">
                <div className="font-semibold">Mission :</div>
                  <textarea
                    required
                    className="w-full input-form"
                    rows="4"
                    placeholder="Type here  about the mission"
                    ref={mission}
                />
              </div>
            </div>
              {/* <div className="flex flex-col gap-5  w-2/5">
                <div className="font-semibold"> Dean email:</div>
                <input
                  required
                  type="email"
                  name="year"
                  className="input-form  w-full"
                  placeholder="Faculty dean email"
                  ref={email}
                  // onBlur={() => getIdByEmail(email)}
                />
              </div> */}

            
            {/* <div className="flex gap-20">
              <div className="flex flex-col gap-5 w-full">
                <div className="font-semibold">About:</div>
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

              
            <div className="flex gap-20">
              <div className="flex flex-col space-y-1 gap-5 w-full">
                {/* <p className=" mb-0 ">Competences:</p> */}
                {/* <DropDown items={["item1", "item2", "item3"]} /> */}
                
                {/* <div class="flex items-center justify-end mr-6 text-lg text-gray-700 capitalize ">
                  <button
                    onClick={handleAddInput}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md"
                  >
                    Add
                  </button>
                </div> */}

                {/* <div className="overflow-x-auto">
                  <table className="min-w-full divide-y  divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="py-2 px-4 text-xl text-left w-[10%]">Code</th>
                        <th className="py-2 px-4 text-xl text-left w-[80%]">Description</th>
                        <th className="py-2 px-4 text-xl text-left w-[10%]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inputs.map((input, index) => (
                        <tr key={index} className="bg-white dark:bg-gray-700">
                          <td className="py-2 px-4">
                            <input
                              type="text"
                              ref={input.ref}
                              className="input-form w-full"
                            />
                          </td>
                          <td className="py-2 px-4">
                            <input
                              type="text"
                              ref={inputs2[index].ref}
                              className="input-form w-full"
                            />
                          </td>
                          <td className="py-2 px-4">
                            <button
                              type="button"
                              onClick={(e) => removeLO1(e, inputs2[index], input)}
                              className="bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
                              data-dismiss-target="#alert-border-2 "
                              aria-label="Close"
                            >
                              <span className="sr-only">Dismiss</span>
                              <svg
                                aria-hidden="true"
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div> */}

              </div>
            </div>
            <div className="flex gap-20 ">
              {<div className="w-1/2">{msg}</div>}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                class="w-[6rem]  text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm md:text-lg px-5 py-2.5 mx-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Create
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

export default addDepartment;
