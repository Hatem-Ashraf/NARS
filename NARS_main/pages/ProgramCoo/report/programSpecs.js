import React from "react";
import CoursesCompetences from "./components/CoursesCompetences";
import { useEffect, useState, useRef, createRef  } from "react";
import LosDescriptionTable from "./components/LosDescriptionTable";
import Graph1 from './components/Graph1';
import FlowChart from './components/FlowChart';
import { useDispatch, useSelector } from "react-redux";


const programReport = ({ cookies }) => {

  const userState = useSelector((state) => state.user);
  const [programData, setProgramData] = useState();
  const [basicInfo, setBasicInfo] = useState({})
  
  useEffect(() => {
    async function getCourses() {
      try {
       
        const resp1 = await fetch(`http://localhost:8086/getOneProgram/${userState.program}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userState.token,
          },
        });
      
        const res = await resp1.json();
        const program = res.data;
        console.log("program data :::::::::::::::: ::::::::::: :::::::::::", program)
        


        const resp = await fetch(`http://localhost:8083/${userState.faculty}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userState.token,
          },
        });
      
        const faculty = await resp.json();
        console.log("faculty data :::::::::::::::: ::::::::::: :::::::::::", faculty)

        //HEREEEEE
      // console.log("faculty", faculty)
        //set the state

        console.log("DATAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA :::::: ::::: ::::",{
          facultyMission: faculty.data.mission,
          programMission: program.program.mission,
          programName: program.program.name,
          programSpec: "Communication and Electronics Engineering and Computer Engineering",
          programDuration: "10 semesters (5-years)",
          programStruc: "Credit hours system"
        })
      
        setBasicInfo({
          facultyMission: faculty.data.mission,
          programMission: program.program.mission || "No mission",
          programName: program.program.name,
          programSpec: "Communication and Electronics Engineering and Computer Engineering",
          programDuration: "10 semesters (5-years)",
          programStruc: "Credit hours system"
        })

      } catch (error) {
        console.error('Error fetching data in useEffect:', error);
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
  return (
    <div>
      <div className="flex flex-row min-h-screen mt-2">
        <form className="bg-sky-50 min-h-screen w-[90%] mx-auto flex flex-col  text-black rounded-2xl">
          <div className="contentAddUser2 flex flex-col gap-10 overflow-auto scrollbar-none mx-auto">
          <div id="pdfContent p-5">
          <label class="label-form text-4xl text-center font-bold">
            Program Report
            </label>
            <LosDescriptionTable 
              programMission={basicInfo.programMission}
              facultyMission={basicInfo.facultyMission}
              programSpec={basicInfo.programSpec}
              programName={basicInfo.programName}
              programStruc={basicInfo.programStruc}
              programDuration={basicInfo.programDuration}
            />
            <Graph1 cookies={cookies}/>
            <CoursesCompetences cookies={cookies} />
            <FlowChart cookies={cookies} />
          </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default programReport;
