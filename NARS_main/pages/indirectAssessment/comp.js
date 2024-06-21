import React, { useEffect, useState } from 'react';

const Competences = () => {
  const [competences, setCompetences] = useState([]);

  useEffect(() => {
    const fetchCompetences = async () => {
      try {
        const response = await fetch('http://localhost:8085/competences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            departmentIds: ["6603924a5a91f5aa4add3865"],
            facultyIds: ["660390bd5a91f5aa4add384f"],
            programIds: ["660393995a91f5aa4add3888"],
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch competences');
        }

        const data = await response.json();
        const combinedCompetences = [
          ...data.selectedCompetences.departmentCompetences,
          ...data.selectedCompetences.facultyCompetences,
          ...data.selectedCompetences.programCompetences,
        ];
        setCompetences(combinedCompetences);
      } catch (error) {
        console.error('Error fetching competences:', error.message);
      }
    };

    fetchCompetences();
  }, []);

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-indigo-900 ">Competences</h1>
      <div className="flex flex-col space-y-6">
        {competences.map((competence) => (
          <div key={competence._id} className="bg-white rounded-lg shadow-lg p-6 transition-transform transform ">
            <h2 className="text-xl font-semibold mb-2 text-c">Code: {competence.code}</h2>
            <p className="text-gray-700 font-semibold mb-4">Level: {competence.level}</p>
            <p className="text-gray-600 font-semibold">Description: {competence.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Competences;
