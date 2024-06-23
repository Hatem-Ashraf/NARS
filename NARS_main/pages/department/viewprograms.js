import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import ProgramList from "@/components/program/programList";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


const viewfaculty = ({ cookies }) => {
  const userState = useSelector((s) => s.user);
  if (userState.role != "department admin" || userState.loggedInStatus != "true") {
    return <div className="error">404 could not found</div>;
  }

  useEffect(() => {
    // document.querySelector("body").classList.add("scrollbar-none");
  });
  console.log(cookies.token);
  const router = useRouter();
  const [faculty, setFaculty] = useState([]);
  const [department, setDepartment] = useState([]);
  useEffect(() => {
    submitHandler();
  }, []);
  const submitHandler = async (e) => {
    if (e) {
      e.preventDefault();
    }
    try {
      const resp1 = await fetch(`http://localhost:8084/${userState.department}`, {
        headers: {
          Authorization: "Bearer " + userState.token,
        },
      });
      const data2 = await resp1.json();
      setDepartment(data2.data.name);

      const resp = await fetch(`http://localhost:8086/${userState.faculty}/department/${userState.department}`, {
        headers: {
          Authorization: "Bearer " + userState.token,
        },
      });
      const data = await resp.json();
      console.log("data.data::",data.data);
      let arr = data.data.programs;

      arr = arr.map((e) => {
        return {
          name: e.name,
          id: e._id,
          programHead: e.programHead,
          qualityCoordinator: e.qualityCoordinator
        //   dean: e.dean,
        //   about: e.about,
        //   competences_id_array: e.competences,
          // academicYears: e.academicYears,
        };
      });
      setFaculty(arr);
    } catch (e) {
      console.log(e);
    }
  };

  const handleClick = () => {
    const header = [
      "Name",
      "Dean",
      "About",
    ];

    const rows = faculty.map((item) => [
      item.name,
      item.dean,
      item.about,
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
    saveAs(file, "Faculties.xlsx");
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
              <h1 className="text-5xl font-bold text-center mb-10 mt-4 text-indigo-600"> <span className="text-red-300"> {department} </span> Program List</h1>
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
                  <ProgramList
                    faculties={faculty} 
                    setFaculties={setFaculty}
                    delete_url={`http://localhost:8086/${userState.faculty}/department/${userState.department}/program/`}
                    />
                </>
              {/* <FacultyList faculties={faculty} setFaculties={setFaculty}/> */}
            </div>
          </div>
        </div>
    </>
  );
};

export default viewfaculty;
