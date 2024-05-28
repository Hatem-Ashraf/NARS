import React from "react";

const CompatibilityMatrixTable = () => {
  const programEducationalObjectives = [
    {
      number: "PEO#1",
      description: "Establishing students' understanding of the basics of communications engineering, computer systems and software, and then providing them with the ability to operate and design different systems in those fields."
    },
    {
      number: "PEO#2",
      description: "Preparing a graduate who has effective communication skills, teamwork, and cooperation with all disciplines, which qualifies him to assume responsibility and take into account societal values and ethics of the profession."
    },
    {
      number: "PEO#3",
      description: "Providing engineers with the ability to solve problems update and develop in the specialized field, which leads to economic growth."
    },
    {
      number: "PEO#4",
      description: "Qualifying graduates to work in the field of communication systems or computer science and software, using the latest technologies in those areas and competing in the local and regional markets."
    },
    {
      number: "PEO#5",
      description: "Preparing a graduate who can apply the foundations of engineering sciences, logical analysis, and deduction to move forward to conduct advanced research studies in the fields of communications engineering and computer systems."
    },
    {
      number: "PEO#6",
      description: "Providing an educational environment and teaching methods that support students' abilities of creativity, innovation, and entrepreneurship."
    }
  ];

  const programMissionKeywords = [
    "Knowledge and skills",
    "Compete in the labor market",
    "Conducting research studies",
    "Scientific and professional development",
    "Culture of innovation, entrepreneurship",
    "Responsibility, within the framework of professional ethical standards"
  ];

  const programObjectives = [
    "PEO#1",
    "PEO#2",
    "PEO#3",
    "PEO#4",
    "PEO#5",
    "PEO#6"
  ];

  const matrix = [
    [true, false, false, false, false, false],
    [false, true, false, false, false, false],
    [false, false, true, false, false, false],
    [false, false, false, true, false, false],
    [false, false, false, false, true, false],
    [false, false, false, false, false, true]
  ];

  return (
    <div className="flex flex-col items-center">
      <h2 className="font-bold text-xl mb-2">Program Educational Objectives (PEOs)</h2>
      <div className="h-0.5 w-full bg-gray-300 mb-2" />
      <table className="border-2 border-collapse mt-6">
        <thead className="bg-blue-50">
          <tr>
            <th className="border-2 p-2">PEO Number</th>
            <th className="border-2 p-2">PEO Description</th>
          </tr>
        </thead>
        <tbody>
          {programEducationalObjectives.map((peo, index) => (
            <tr key={index} className="border-2">
              <td className="border-2 p-2 bg-blue-50">{peo.number}</td>
              <td className="border-2 p-2">{peo.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="font-bold text-xl mt-8">
        Compatibility Matrix of "Program Mission Vs Program Objectives"
      </h2>
      <table className="border-2 border-collapse mt-6" style={{ width: "100%" }}>
        <thead className="bg-blue-50">
          <tr>
            <th className="border-2 p-2">Program Mission Keywords</th>
            {programMissionKeywords.map((objective, index) => (
              <th key={index} className="border-2 p-2 text-center">
                {objective}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {programObjectives.map((keyword, rowIndex) => (
            <tr key={rowIndex} className="border-2">
              <td className="border-2 p-2 bg-blue-50">{keyword}</td>
              {matrix[rowIndex].map((value, colIndex) => (
                <td key={colIndex} className="border-2 p-2 text-center ">
                  {value ? "✓" : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompatibilityMatrixTable;
