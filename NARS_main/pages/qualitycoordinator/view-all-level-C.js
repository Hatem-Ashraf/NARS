import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import UserCard from "@/components/user/UserCard";
import ObjectivesList from "./objectives";
import CompetencesList from "@/components/quality/competences";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";

const competences = ({ cookies }) => {
  const userState = useSelector((s) => s.user);
  const router = useRouter();
  const [competences, setcompetences] = useState([]);
  const [filteredcompetences, setFilteredcompetences] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [filteredObjectives, setFilteredObjectives] = useState([]);
  
  useEffect(() => {
    // document.querySelector("body").classList.add("scrollbar-none");
    submitHandler();
  }, []);

  const submitHandler = async () => {
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
      setFilteredcompetences(data.data);
      
      const resp2 = await fetch(`http://localhost:8085/programObj/faculty/${userState.faculty}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: "Bearer " + userState.token,
            },
        });
      const data2 = await resp2.json();
      console.log("data.objectives", data2.data);
      setObjectives(data2.data);
      setFilteredObjectives(data2.data);

    } catch (e) {
      console.log(e);
    }
  };

  const handleClick = () => {
    const header = [
      "Code",
      "Description",
      "Level",
    ];

    const rows = competences.map((item) => [
      item.code,
      item.description,
      item.level,
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
    saveAs(file, "Competences-C.xlsx");
  };

  const handleClick2 = () => {
    const header = [
      "Code",
      "Description",
    ];

    const rows = objectives.map((item) => [
      item.code,
      item.description,
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
    saveAs(file, "Program-Objectives.xlsx");
  };

  const filtercompetences = (event) => {
    const filtered = competences.filter((e) => e.code.startsWith(event.target.value));
    setFilteredcompetences(filtered);
  };

  const filterObjectives = (event) => {
    const filtered = objectives.filter((e) => e.code.startsWith(event.target.value));
    setFilteredObjectives(filtered);
  };

  return (
    <>
        <div className="mx-auto contentAddUser3 w-full flex flex-col gap-10">
          <div className=" min-h-screen m-auto flex w-full justify-center p-5 "  >
            <div className="w-full p-8 rounded-lg" >
              <h1 className="text-3xl font-bold text-center mb-6 mt-4 text-indigo-600">Level C Competences</h1>
              <form onSubmit={submitHandler} className="mb-4">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    className="w-2/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-xl"
                    placeholder="Search by competence Code"
                    onChange={filtercompetences}
                  />
                  <button
                    type="button"
                    onClick={handleClick}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-all duration-200 text-xl float-right"
                  >
                    Download Excel
                  </button>
                </div>
              </form>
 
                  <h2 className="text-xl font-semibold mb-2">Competence List</h2>
                  <CompetencesList 
                  competences={filteredcompetences} 
                  setCompetences={setFilteredcompetences}  
                  level="level-C"
                  delete_url={`http://localhost:8085/`}
                  create_file_name="AddLevelC-comp"
                  />

                  <div className="my-20"></div>
                  <h2 className="text-xl font-semibold mb-2">Objective List</h2>
                  <div className="flex items-center justify-between mb-8">
                    <input
                      type="text"
                      className="w-2/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-xl"
                      placeholder="Search by objective Code"
                      onChange={filterObjectives}
                    />
                    <button
                      type="button"
                      onClick={handleClick2}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-all duration-200 text-xl float-right"
                    >
                      Download Excel
                    </button>
                  </div>
                  <ObjectivesList 
                  competences={filteredObjectives} 
                  setCompetences={setFilteredObjectives}  
                  level="level-C-obj"
                  delete_url="http://localhost:8085/programObj/"
                  create_file_name="AddLevelC-obj"
                  />

            </div>
          </div>
        </div>
    </>
  );
};

export default competences;
