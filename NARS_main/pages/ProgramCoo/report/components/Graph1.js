import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const RelationshipMatrixTable = () => {
  const userState = useSelector((state) => state.user);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await fetch(`http://localhost:8086/grade`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + userState.token,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      setGrades(data || []);
      console.log("API Response2:", data);
    } catch (error) {
      console.error("Error fetching grades:", error);
    }
  };

  const generateTableData = () => {
    const header = ["Academic year", "Grade", "No. Student", "Percentage %"];
    const rows = grades.flatMap(year =>
      year.grades.map(grade => [
        year.academicYear,
        grade.grade,
        grade.numberOfStudents,
        `${grade.percentage}%`
      ])
    );

    return { header, rows };
  };

  const { header, rows } = generateTableData();

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="font-bold text-xl mt-8">Professional Information</h2>
      <div className="h-0.5 w-full bg-gray-300 mb-2" />
      <div className="w-full mt-6">
        <h3 className="font-bold text-lg">Statistics:</h3>
        <p>No. of students enrolled in the 4 academic years of the programme: {
          grades.reduce((sum, year) =>
            sum + (year.grades ? year.grades.reduce((acc, g) => acc + g.numberOfStudents, 0) : 0), 0
          )
        }</p>
        <h3 className="font-bold text-lg mt-4">Number of students and percentage of success</h3>
        <table className="border-2 border-collapse w-full mt-2">
          <thead>
            <tr>
              {header.map((col, idx) => (
                <th key={idx} className="border-2 p-2">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border-2 p-2">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2">*The total No. of Preparatory year (585) is divided among all Faculty departments.</p>
        <p className="mt-4">Direction of joining the program in proportion to the numbers entrants’ program during the last three years: Increasing Constant Decreasing</p>
        <p>No. of students who fulfilled the program and their percentage to those who were enrolled (see above table)</p>
        <h3 className="font-bold text-lg mt-4">Employment of graduates:</h3>
        <p>(WE, Vodafone, Etisalat Misr, Huawei, Valeo, BlueCloud Technologies, Higher Education universities and Institutes, Military Factories, EgyptAir, ABB, Hewlett-Packard, Binladin Group, National Air Navigation Services Company)</p>
      </div>
    </div>
  );
};

export default RelationshipMatrixTable;
