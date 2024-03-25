import { createRef } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useRef, useEffect } from "react";
import { useRouter } from 'next/router';

import React from "react";


const addfaculty = ({ cookies }) => {

  const router = useRouter();
  const { comp_id } = router.query;
  console.log("Competence_id", comp_id);

  const userState = useSelector((s) => s.user);
  if (userState.role != "quality coordinator" || userState.loggedInStatus != "true") {
    return <div className="error">404 could not found</div>;
  }
  const [msg, setMsg] = useState("");
  const closeMsg = () => {
    setMsg("");
  };
  const [compCode, setCompCode] = useState("")
  const [compDescrption, setCompDescrption] = useState("")
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

  useEffect(() => {
    const fetchCompetence = async () => {
      try {
        const response = await fetch(`http://localhost:8085/facultyComp/${comp_id}`);
        // if (!response.ok) {
        //   throw new Error('Failed to fetch competence');
        // }
        const competenceData = await response.json();
        console.log("competenceData", competenceData);
        setCompCode(competenceData.competence.code)
        setCompDescrption(competenceData.competence.description)

        // setCompetence(competenceData);
      } catch (error) {
        console.error('Error fetching competence:', error);
      }
    };

    if (comp_id) {
      fetchCompetence();
    }
  }, [comp_id]);
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

  const name = useRef();
  const email = useRef();
  const about = useRef();
  const choosen = useRef();
  const year = useRef();

  const items = [
    "prep",
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
    "sixth",
  ];

  const submitHandler = async (e) => {
    e.preventDefault();
    const arr1 = inputs.map((input1) => {
      return {
        code: input1.ref.current.value,
      };
    });
    const arr2 = inputs2.map((input2) => {
      return {
        value: input2.ref.current.value,
      };
    });
    const competences = arr1.map((a, index) => {
      const b = arr2[index];
      return {
        code: a.code,
        description: b.value,
        level: "A",
      };
    });
    console.log("competences::", competences);
    try {
      const r = await fetch(`http://localhost:8085/updateFacultyComp/${comp_id}`, {
        method: "PUT",
        body: JSON.stringify({
          code: compCode,
          description: compDescrption,
          level: "A",
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + userState.token,
        },
      });
      const resp = await r.json();
      console.log("resp::", resp);
      
      if (resp.status == "fail" || resp.status == "error"|| resp.error) {
        // setErr(resp.error.errors.dean.message);
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
    try {

      const r = await fetch(`http://localhost:8085/facultyComp`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + userState.token,
        },
      });

      const resp = await r.json();
      console.log("All competencies::", resp);
      // console.log(itemsArr);
      // if (resp.status == "fail" || resp.status == "error") {
      //   setErr(resp.error.errors.dean.message);
      //   console.log(resp, err);
      //   setMsg(fail);
      // }
      // else {
      //   setMsg(success);
      //   console.log(resp);
      // }
    } catch (e) {
      console.log("error", e);
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
        Failed to update Competence
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
        Competence has been Updated successfully
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
            <p className="font-normal text-3xl text-indigo-800">Update Level A Competencies</p>
            {/* <div className="flex justify-between gap-20">
              <div className="flex flex-col gap-5 w-2/5">
                <div>Faculty Name:</div>
                <input
                  type="text"
                  name="name"
                  className="input-form w-full"
                  ref={name}
                />
              </div>
              <div className="flex flex-col gap-5  w-2/5">
                <div> Dean email:</div>
                <input
                  type="email"
                  name="year"
                  className="input-form  w-full"
                  ref={email}
                  onBlur={() => getIdByEmail(email)}
                />
              </div>
            </div>


            <div className="flex gap-20">
              <div className="flex flex-col gap-5 w-full">
                <div>About:</div>
                <textarea
                  className="w-full input-form"
                  rows="4"
                  placeholder="Type here  about the faculty"
                  ref={about}
                />
              </div>
            </div> */}
            <div className="flex gap-20">
              <div className="flex flex-col space-y-1 gap-5 w-full">
                <p className="text-2xl text-indigo-500">Competences:</p>
                {/* <div class="flex items-center justify-end mr-6 text-lg text-gray-700 capitalize ">
                  <button
                    onClick={handleAddInput}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md"
                  >
                    Add
                  </button>
                </div> */}

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y  divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="py-2 px-4 text-xl text-left w-[15%]">Code</th>
                        <th className="py-2 px-4 text-xl text-left w-[80%]">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-4">
                          <input
                            type="text"
                            className="input-form w-full"
                            value={compCode}
                            onChange={(e) => setCompCode(e.target.value)}
                          />
                          </td>
                          <td className="py-2 px-4">
                          <input
                            type="text"
                            className="input-form w-full"
                            value={compDescrption}
                            onChange={(e) => setCompDescrption(e.target.value)}
                          />
                          </td>
                      </tr>
                      {/* {inputs.map((input, index) => ( */}
                        {/* <tr className="bg-white dark:bg-gray-700">
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
                          <td className="py-2 px-4 text-center">
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
                        </tr> */}
                      {/* ))} */}
                    </tbody>
                  </table>
                </div>

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
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
export default addfaculty;
