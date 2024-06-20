import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";

const ProgramCompetences = ({ cookies }) => {
  const userState = useSelector((s) => s.user);
  const router = useRouter();
  const [competences, setCompetences] = useState([]);
  const [filteredCompetences, setFilteredCompetences] = useState([]);
  
  useEffect(() => {
    submitHandler();
  }, []);

  const submitHandler = async () => {
    try {
      const resp = await fetch('http://localhost:8085/programComp', {
        headers: {
          Authorization: "Bearer " + userState.token,
        },
      });
      const data = await resp.json();
      console.log(data);
      setCompetences(data.competences);
      setFilteredCompetences(data.competences);
    } catch (e) {
      console.log(e);
    }
  };

  const handleClick = () => {
    const header = [
      "code",
      "description",
      "level",
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
    saveAs(file, "program_competences.xlsx");
  };

  const filterCompetences = (event) => {
    const filtered = competences.filter((e) => e.code.startsWith(event.target.value));
    setFilteredCompetences(filtered);
  };

  return (
    <>
      <div className="mx-auto contentAddUser3 w-full flex flex-col gap-10">
        <div className=" min-h-screen m-auto flex w-full justify-center p-5 "  >
          <div className="w-full p-8 rounded-lg" >
            <h1 className="text-3xl font-bold text-center mb-6 mt-4 text-indigo-600">List of all Program Competences</h1>
            <form onSubmit={submitHandler} className="mb-4">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  className="w-2/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-xl"
                  placeholder="Search by competence Code"
                  onChange={filterCompetences}
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
            {filteredCompetences && filteredCompetences.length > 0 ? (
  <>
                <h2 className="text-xl font-semibold mb-2">Competences List</h2>
                <div>
                  {/* Render your list of competences here */}
                  {filteredCompetences.map((competence, index) => (
                    <div key={index}>
                      <p>Code: {competence.code}</p>
                      <p>Description: {competence.description}</p>
                      <p>Level: {competence.level}</p>
                    </div>
                  ))}
                    </div>
                  </>
                ) : (
                  <p>No competences available.</p>
                )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgramCompetences;

