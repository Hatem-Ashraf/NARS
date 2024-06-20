import React from "react";
import { useEffect, useState, useRef, createRef  } from "react";
import CoursesCompetences from "./components/CoursesCompetences";
import LosDescriptionTable from "./components/LosDescriptionTable";
import Graph1 from './components/Graph1';
import FlowChart from './components/FlowChart';
import { useDispatch, useSelector } from "react-redux";
import generatePdf from 'pages/ProgramCoo/downloadSpecs.js';



const programReport = ({ cookies }) => {
  
  const programsList = useRef();
  const userState = useSelector((state) => state.user);
  const [selID, setSelID] = useState(null)
  const [basicInfo, setBasicInfo] = useState({
    facultyMission: "--",
    programMission: "--",
    programName: "--",
    programSpec: "--",
    programDuration: "--",
    programStruc: "--"
  })
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: "Cryptography and Information Security",
      code: "CCE506",
      hours: "",
      information: "",
      aims: "",
    },
  ]);


  //GET ALL PROGRAMS
  useEffect(() => {
    async function getCourses() {
      try {
        // Fetch the array of course IDs assigned to the user
        const response = await fetch(`http://localhost:8086/facultyPrograms/${userState.faculty}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.token}`,
          },
        });
    
        // if (response.status != "success") {
        //   throw new Error('Failed to fetch assigned courses');
        // }
    
        const programData = await response.json();
        const programs = programData.data.programs;
        console.log("Programs::", programs)
    
        // Create the courses array with valid details
        const programsData = programs.map(e => ({
          name: e.name,
          id: e._id,
          // competences: e.data.qualityCompetencies,
          mission: e.mission || "No mission",
          faculty: e.faculty
          // information: e.data.courseInformation
        }));
    
        // console.log("programs from server:", programsData);
        setCourses(programsData);
    
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    }
    

    getCourses();
       
  }, []);

  const getAvg = (avgs) => {
    const cAvg = {};
    let tempAvg = avgs.map((elm) => {
      let out = {};
      out[elm.code.toUpperCase()] = elm.avg;
      return out;
    });
    tempAvg.forEach((elm) => {
      let temp = Object.keys(elm)[0];
      cAvg[temp] = elm[temp];
    });
    return cAvg;
  };


const handleProgramChange = async() => {
  const selectedId = programsList.current.value;
  console.log("selected program Id", selectedId);
  setSelID(selectedId);

  
  //get the faculty

  const programInfo = courses.filter((el) => el.id === selectedId)
  console.log("programInfo", programInfo)
  //get the the faculty info from the server

  const resp = await fetch(`http://localhost:8083/${programInfo[0].faculty}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + userState.token,
    },
  });

  const faculty = await resp.json();
  //HEREEEEE
// console.log("faculty", faculty)
  //set the state

  setBasicInfo({
    facultyMission: faculty.data.mission,
    programMission: programInfo[0].mission,
    programName: programInfo[0].name,
    programSpec: "Communication and Electronics Engineering and Computer Engineering",
    programDuration: "10 semesters (5-years)",
    programStruc: "Credit hours system"
  })



  }
  

  return (
    <div>
      <div className="flex flex-row min-h-screen mt-2">
        <form className="bg-sky-50 min-h-screen w-[90%] mx-auto flex flex-col  text-black rounded-2xl">
          <div className="contentAddUser2 flex flex-col gap-10 overflow-auto scrollbar-none mx-auto">
          <div className="flex justify-end">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  generatePdf();
                }}
                target="_blank"
                download
                className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded"
              >
                Download PDF
              </button>
            </div>
          <div id="pdfContent" className="p-5">
            <label class="label-form text-4xl text-center font-bold">
              Program Report
            </label>


            <label htmlFor="title" className="text-form font-bold w-1/3">Program Title:</label>
            <select
              ref={programsList}
              id="small"
              class="choose-form w-full px-10"
              onChange={handleProgramChange}
            >
              <option className="text-left" disabled selected>
                Choose a Program
              </option>
              {courses.map((e) => {
                return <option value={e.id}>{e.name}</option>;
              })}{" "}
            </select>
            { setSelID != null ? (

            <>
              <LosDescriptionTable 
                programMission={basicInfo.programMission}
                facultyMission={basicInfo.facultyMission}
                programSpec={basicInfo.programSpec}
                programName={basicInfo.programName}
                programStruc={basicInfo.programStruc}
                programDuration={basicInfo.programDuration}
              />
              <Graph1 cookies={cookies} programID={selID}/>
              <CoursesCompetences cookies={cookies} programID={selID} />
              <FlowChart cookies={cookies} programID={selID}/>
            </>
           ) : (
            <div>Please Select a program.</div>
           ) }
          </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default programReport;
