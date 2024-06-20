import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";


const CompetencesTable = () => {
  const [competences, setCompetences] = useState([]);
  const [competencesB, setCompetencesB] = useState([]);
  const [competencesC, setCompetencesC] = useState([]);
  const userState = useSelector((state) => state.user);

  useEffect(() => {
    fetchCompetences();
  }, []);

  const fetchCompetences = async () => {
    try {
      const response = await fetch(`http://localhost:8085/faculty/${userState.faculty}/level/A`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (data.status !== "success") {
        throw new Error(`HTTP error! Status: ${data.status}`);
      }

      if (!data) {
        console.error("API returned unexpected data structure:", data);
        return;
      }

      console.log("API Response - Competences:", data.competences);
      setCompetences(data.data);

      //LeveL B
      const response2 = await fetch(`http://localhost:8085/faculty/${userState.faculty}/level/B`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data2 = await response2.json();

      if (data2.status !== "success") {
        throw new Error(`HTTP error! Status: ${data2.status}`);
      }

      if (!data2) {
        console.error("API returned unexpected data2 structure:", data2);
        return;
      }

      console.log("API Response - Competences:", data2.data);
      setCompetencesB(data2.data);
      
      //LeveL BC
      const response3 = await fetch(`http://localhost:8085/faculty/${userState.faculty}/level/C`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data3 = await response3.json();

      if (data3.status !== "success") {
        throw new Error(`HTTP error! Status: ${data3.status}`);
      }

      if (!data3) {
        console.error("API returned unexpected data3 structure:", data3);
        return;
      }

      console.log("API Response - Competences:", data3.data);
      setCompetencesC(data3.data);
    } catch (error) {
      console.error("Error fetching competences:", error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="font-bold text-xl mt-8">Competences Table (All Levels)</h2>
      <div className="h-0.5 w-full bg-gray-300 mb-2" />
      <div className="w-full mt-6">
        <table className="border-2 border-collapse w-full mt-2">
          <thead>
            <tr>
              <th className="border-2 p-2">Code</th>
              <th className="border-2 p-2">Description</th>
              <th className="border-2 p-2">Level</th>
            </tr>
          </thead>
          <tbody>
            {competences.map((competence, index) => (
              <tr key={index}>
                <td className="border-2 p-2 text-center">{competence.code}</td>
                <td className="border-2 p-2 px-5">{competence.description}</td>
                <td className="border-2 p-2 text-center">{competence.level}</td>
              </tr>
            ))}
            {competencesB.map((competence, index) => (
              <tr key={index}>
                <td className="border-2 p-2 text-center">{competence.code}</td>
                <td className="border-2 p-2 px-5">{competence.description}</td>
                <td className="border-2 p-2 text-center">{competence.level}</td>
              </tr>
            ))}
            {competencesC.map((competence, index) => (
              <tr key={index}>
                <td className="border-2 p-2 text-center">{competence.code}</td>
                <td className="border-2 p-2 px-5">{competence.description}</td>
                <td className="border-2 p-2 text-center">{competence.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompetencesTable;
