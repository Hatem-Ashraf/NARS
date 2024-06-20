import React, { useEffect, useState } from "react";

const CompetencesTable = () => {
  const [competences, setCompetences] = useState([]);

  useEffect(() => {
    fetchCompetences();
  }, []);

  const fetchCompetences = async () => {
    try {
      const response = await fetch("http://localhost:8085/facultyComp", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (!data || !data.competences) {
        console.error("API returned unexpected data structure:", data);
        return;
      }

      console.log("API Response - Competences:", data.competences);
      setCompetences(data.competences);
    } catch (error) {
      console.error("Error fetching competences:", error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="font-bold text-xl mt-8">Competences Table(Level-1)</h2>
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
                <td className="border-2 p-2">{competence.code}</td>
                <td className="border-2 p-2">{competence.description}</td>
                <td className="border-2 p-2">{competence.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompetencesTable;
