import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import DepartmentList from "./departmentList";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


const viewDepartment = ({ cookies }) => {

  const userState = useSelector((s) => s.user);

  if (userState.role != "system admin" || userState.loggedInStatus != "true") {
    return <div className="error">404 could not found</div>;
  }

  async function fetchDataForIds(ids) {
    let fetchedData = [];
    for (let id of ids) {
        try {
            const response = await fetch(`http://localhost:8083/${id}`, {
              headers: {
                Authorization: "Bearer " + userState.token,
              },
            });
            // if (!response.ok) {
            //     throw new Error(`HTTP error! Status: ${response.status}`);
            // }
            const data = await response.json();
            fetchedData.push(data.data);
            console.log("data.data._id", data.data._id);
        } catch (error) {
            console.error(`Error fetching data for faculty ID ${id}:`, error.message);
        }
    }
    return fetchedData;
}

  console.log(cookies.token);
  const router = useRouter();
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    submitHandler();
  }, []);
  const submitHandler = async (e) => {
    if (e) {
      e.preventDefault();
    }
    try {
      const resp = await fetch(`http://localhost:8084/`, {
        headers: {
          Authorization: "Bearer " + userState.token,
        },
      });
      const data = await resp.json();
      console.log("data.data::",data.data);

      let faculties_id = [...new Set(data.data.map((e) => e.facultyId))];
      // console.log("faculties_id", faculties_id);

      // Assuming faculties_id contains the non-repeated IDs
      const faculties = await fetchDataForIds(faculties_id)
      console.log("faculties:", faculties);

      let deps = data.data;
      let finalArray = faculties.map((fac) => {
          return {
              name: fac.name,
              id: fac._id,
              deps:
            deps.map((e) => {
              if (e.facultyId === fac._id) {
                  // console.log(`${e.facultyId} === ${fac._id}`, e.facultyId === fac._id)
                  // console.log("Checked")
                  return {
                      id: e._id,
                      name: e.name,
                      code: e.code,
                      departmentHead: e.departmentHead,
                      about: e.about,
                      vision: e.vision,
                      mission: e.mission,
                      facultyId: e.facultyId,
                      competences_id_array: e.competences,
                      // academicYears: e.academicYears,
                  };
              }
              return null; // Return null for elements that don't match
          }).filter(obj => obj !== null) // Filter out null elements
        }
      });


      console.log("finalArray::", finalArray)
      setDepartments(finalArray);

      // arr = arr.map((e) => {
      //   return {
      //     name: e.name,
      //     code: e.code,
      //     departmentHead: e.departmentHead,
      //     about: e.about,
      //     vision: e.vision,
      //     mission: e.mission,
      //     facultyId: e.facultyId,
      //     competences_id_array: e.competences,
      //     // academicYears: e.academicYears,
      //   };
      // });
    } catch (e) {
      console.log(e);
    }
  };

  const handleClick = () => {
    const workbook = XLSX.utils.book_new();
  
    departments.forEach(faculty => {
      const header = ["Name", "Code", "about", "Head of Department"];
      const rows = faculty.deps.map(item => [item.name, item.code, item.about, item.vision, item.departmentHead, item.mission]);
      const worksheetData = [header, ...rows];
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, faculty.name);
    });
  
    const fileBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const file = new Blob([fileBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(file, "Departments.xlsx");
  };
  

  const filtercompetences = (event) => {
    const filtered = competences.filter((e) => e.code.startsWith(event.target.value));
    setFilteredcompetences(filtered);
  };

  return (
    <>
        <div className="mx-auto contentAddUser3 w-full flex flex-col gap-10">
          <div className=" min-h-screen m-auto flex w-full justify-center p-5 "  >
            <div className="w-full p-8 rounded-lg" >
              <h1 className="text-5xl font-bold text-center mb-10 mt-4 text-indigo-600">Department List</h1>
              <form onSubmit={submitHandler} className="mb-4">
                <div className="flex items-center justify-end">
                  {/* <input
                    type="text"
                    className="w-2/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-xl"
                    placeholder="Search by faculty name"
                    // onChange={filtercompetences}
                  /> */}
                  <button
                    type="button"
                    onClick={handleClick}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-all duration-200 text-xl float-right"
                  >
                    Download Excel
                  </button>
                </div>
              </form>
              {/* {filteredcompetences.length > 0 ? ( */}
                <>
                  <DepartmentList 
                    departments={departments} 
                    setDepartments={setDepartments}
                    delete_url="http://localhost:8084"
                  />
                </>
              {/* <FacultyList faculties={faculty} setFaculties={setFaculty}/> */}
            </div>
          </div>
        </div>
    </>
  );
};




export default viewDepartment;
