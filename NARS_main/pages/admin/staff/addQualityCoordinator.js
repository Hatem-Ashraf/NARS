import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useEffect } from "react";
import { successFailMsg } from "@/components/successFail/success-fail";
import Cookies from "js-cookie";
import { useState } from "react";
import { read, utils } from "xlsx";
import CircularJSON from "circular-json";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DropdownRoles from "@/components/user/DropDownRoles";
const addStaff = ({ cookies }) => {
  const userState = useSelector((s) => s.user);
  if (userState.role != "system admin" || userState.loggedInStatus != "true") {
    return <div className="error">404 could not found</div>;
  }
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const handleDivClick = (event) => {
    const checkbox = event.currentTarget.querySelector(
      'input[type="checkbox"]'
    );
    if (checkbox) {
      checkbox.click();
    }
  };
  const handleRoleChange = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    setSelectedRoles((prevSelectedRoles) => {
      if (isChecked) {
        return [...prevSelectedRoles, value];
      } else {
        return prevSelectedRoles.filter((role) => role !== value);
      }
    });
  };

  const [faculyTitles, setFacultyTitles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);

  const handleFacultyChange = async () => {
    const selectedFacultyId = faculty.current.value;
    console.log(selectedFacultyId);

    const resp = await fetch(
      `http://localhost:8083/${selectedFacultyId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userState.token,
        },
      }
    );
    let tempArray = [];
    const data = await resp.json();

    // data.data.departments.map(async (d) => {
    //   const resp = await fetch(
    //     `http://localhost:8084/?name=${d}`,
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: "Bearer " + userState.token,
    //       },
    //     }
    //   );
    //   const data = await resp.json();
    //   console.log(data);
    //   console.log(data);
    //   console.log(data);
    //   console.log(data);
    //   console.log(data);
    //   tempArray.push({ name: data.data[0].name, id: data.data[0]._id });
    //   console.log(tempArray);
    // });
    console.log(tempArray);
    console.log(data);
    console.log(data);
    console.log(data);
    console.log(data);
    console.log(data);
    console.log(data);
    console.log(data);
    setTimeout(() => {
      setDepartments(tempArray);
    }, 500);
  };
  const downloadTemplateHandler = () => {
    const header = [
      "name",
      "role",
      "email",
      "faculty"
    ];
    let staff = [
      {
        name: "Hatem Ashraf",
        role: "quality coordinator",
        email: "hatem12@ds.com",
        faculty: "Faculty of Science"
      },
      {
        name: "Sayed Ibrahim",
        role: "quality coordinator",
        email: "sayed166@ds.com",
        faculty: "Faculty of Science"
      },
      {
        name: "Rana Tarek",
        role: "quality coordinator",
        email: "rana133@ds.com",
        faculty: "Faculty of Science"
      },
    ];
    const rows = staff.map((item) => [
      item.name,
      item.role,
      item.email,
      item.faculty
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([header, ...rows]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const fileBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const file = new Blob([fileBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(file, "staffTemplate.xlsx");
  };

  const department = useRef();
  const program = useRef();
  const faculty = useRef();
  const [exportModalIsOpen, setExportModalIsOpen] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    async function getFacultyNames() {
      const d = await fetch(`http://localhost:8083/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + cookies.token,
        },
      });

      const data = await d.json();
      let a = data.data.map((e) => {
        return { name: e.name, id: e._id };
      });

      setFacultyTitles(a);
    }
    getFacultyNames();
  }, []);
  function handleFile(event) {
    try{

      const files = event.target.files;
      const f = files[0];
  
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = read(data, { type: "array" });
        const firstSheet = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheet];
        const sheetData = utils.sheet_to_json(worksheet);
        console.log(sheetData);
        setData(sheetData);
        setExportModalIsOpen(true);
        document.body.classList.toggle("overflow-hidden");
      };
      reader.readAsArrayBuffer(f);

    }catch(e){
      console.error(e)
    }
    
  }
  const exportHandler = async () => {
    try{
    document.body.classList.toggle("overflow-hidden");

    const promises = data.map(async (row) => {
      const { name, role, email, faculty } = row;
      // console.log(role);
      // console.log(rolesArr);
      const obj = {
        name,
        roles: role,
        email,
        faculty: "65eb1d67d1555f7450c9a027",
      };
      console.log("obj inside the loop", obj);
  
      const resp = await fetch('http://localhost:8081/newQualityCoordinator', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(obj),
      });
  
      return resp.json();
    });
  
    const responseData = await Promise.all(promises);
    console.log(responseData);
    function checkAllFieldsSuccess(responseData) {
      for (const field of responseData) {
        if (field.status !== "success") {
          return false;
        }
      }
      return true;
    }
    const allFieldsSuccess = checkAllFieldsSuccess(responseData);
if(allFieldsSuccess){

  setExportModalIsOpen(false);
  setMsg(success);
}else{
  setExportModalIsOpen(false);
  setMsg(partiallyfailImport);
}
    
}catch(e){
console.error(e);
setExportModalIsOpen(false);
setMsg(failImport);
}
  };

  const token = userState.token;
  const router = useRouter();
  const name = useRef();
  const email = useRef();
  const role = useRef();
  const [msg, setMsg] = useState("");
  const closeMsg = () => {
    setMsg("");
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    // console.log(department.current.value);
    try {
      const resp = await fetch('http://localhost:8081/newQualityCoordinator', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          roles: "quality coordinator",
          name: name.current.value,
          email: email.current.value,
          faculty: faculty.current.value,
        }),
      });
      const data = await resp.json();
      console.log(data);
      if (data.status == "success") {
        setMsg(success);
      } else {
        setMsg(fail);
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
      <div class="ml-3 text-sm font-medium">
        Something went wrong please try again
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
  let failImport = (
    <div
      id="alert-border-2"
      class="flex p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800"
      role="alert"
    >
      <i class="fa-sharp fa-solid fa-circle-exclamation"></i>
      <div class="ml-3 text-sm font-medium">
        Imported data is not in the right format please download the template and follow the format.
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
  let partiallyfailImport = (
    <div
      id="alert-border-2"
      class="flex p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800"
      role="alert"
    >
      <i class="fa-sharp fa-solid fa-circle-exclamation"></i>
      <div class="ml-3 text-sm font-medium">
        Parts of the imported data is not in the right format please download the template and follow the format.
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
      <div class="ml-3 text-sm font-medium">
        Staff has been added successfully
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
  const exportCancel = () => {
    document.body.classList.toggle("overflow-hidden");

    setExportModalIsOpen(false);
  };

  return (
    <>
      {exportModalIsOpen ? (
        <div className="fixed inset-0 flex justify-center items-center z-20 h-screen" >
          <div className=" container relative  rounded-lg p-6 w-[40rem] bg-white text-black border-2 shadow-xl border-black  ">
            <button
              onClick={exportCancel}
              className=" bg-red-500 text-white duration-200 transition-all hover:bg-red-600 px-2 rounded absolute top-4 right-4"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
            <div className="overflow-auto h-64 my-10">
              {data.length > 0 && (
                <table className="relative   w-full text-center">
                  <thead>
                    <tr>
                      {Object.keys(data[0]).map((key) => (
                        <th key={key} className="px-4 py-2">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, index) => (
                          <td key={index} className="border px-4 py-2">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="flex justify-between items-center">
              <div>Please confirm the data and click submit </div>
              <button
                onClick={() => exportHandler()}
                class=" my-6  px-10 py-3 duration-200 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm md:text-lg  mx-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <div
        className={`flex flex-row h-screen `}
      >
        <form
         
          onSubmit={submitHandler}
          className=" h-screen w-screen flex m-auto flex-col justify-center items-center text-black rounded-2xl"
        >
          <div className="contentAddUser2 mx-auto flex flex-col gap-10">
            <p className="text-3xl font-bold text-blue-800 mb-6 mt-4">Add Quality Coordinator</p>
            <div className="flex gap-10 w-full ">
              <div className="flex flex-col gap-5  w-2/6">
                <div> Name</div>
                <input
                  ref={name}
                  type="text"
                  className="inputAddUser2  w-full"
                  placeholder={`Staff name`}
                />
              </div>
              <div className="flex flex-col gap-5  w-3/6 ">
                <div> Email </div>
                <input
                  ref={email}
                  type="text"
                  className="inputAddUser2   w-full "
                  placeholder={`Staff E-mail`}
                />
              </div>
            </div>

            <div className="flex gap-10 ">
              <div className="flex flex-col gap-5 w-3/5  ">
                <div> Faculty</div>
                <select
                  ref={faculty}
                  id="small"
                  class="choose-form w-full px-10"
                  onChange={handleFacultyChange}
                >
                  <option className="text-left" disabled selected>
                    Choose a Faculty
                  </option>
                  {faculyTitles.map((e) => {
                    return <option value={e.id}>{e.name}</option>;
                  })}{" "}
                </select>
              </div>
            </div>

            <div className="flex gap-10 w-full">
              <div className="flex flex-col justify-between items-center w-full">
                <div className="w-1/2">{msg}</div>
                <div className="flex space-x-2 justify-center">
                  <button
                    type="button"
                    class="my-6 px-10 py-1 duration-200 text-white  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg md:text-lg text-sm  mx-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800 whitespace-no-wrap"
                    onClick={downloadTemplateHandler}
                  >
                    Download Template
                  </button>
                  <input
                    type="file"
                    id="selectFile"
                    className="hidden"
                    onChange={handleFile}
                  />
                  <label
                    htmlFor="selectFile"
                    className="my-6 text-center px-10 duration-200 text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm md:text-lg mx-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800 flex items-center justify-center"
                  >
                    Import
                  </label>
                  <button
                    type="submit"
                    className="my-6 px-10 py-1 duration-200 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm md:text-lg mx-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
            {/* <div className="flex ">
              <div className="flex flex-col">
                <div>Department </div>
                <input type="text" className="inputAddUser2 w-full" />
              </div>
              <div className="flex justify-end w-full space-x-8 items-center">
                {<div className="w-1/2 ">{msg}</div>}
                <input
                  type="file"
                  id="selectFile"
                  class="hidden"
                  onChange={handleFile}
                />
                <label
                  for="selectFile"
                  class=" my-6  px-10 py-3 duration-200 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm md:text-lg  mx-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
                >
                  Import
                </label>
                <button
                  type="submit"
                  class=" my-6  px-10 py-3 duration-200 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm md:text-lg  mx-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Submit
                </button>
              </div>
            </div> */}
          </div>
        </form>
      </div>
    </>
  );
};
export default addStaff;
