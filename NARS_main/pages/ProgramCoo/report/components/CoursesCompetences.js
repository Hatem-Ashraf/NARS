import React from "react";

const RelationshipMatrixTable = () => {
  const facultyMissionKeywords = [
    "prepare a graduate with competencies and problem-solving skills",
    "compete in local and regional labor markets",
    "innovate and become an entrepreneur",
    "development of engineering sciences",
    "producing internationally distinguished scientific research",
    "human values and social responsibility"
  ];

  const programMissionKeywords = [
    "knowledge and skills",
    "compete in the labor market locally and regionally",
    "conducting research studies",
    "scientific and professional development",
    "culture of innovation, entrepreneurship",
    "societal responsibility, within the framework of professional ethical standards"
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
      <h2 className="font-bold text-xl mb-2">
        The relationship matrix of "Institute's Mission Vs Program’s Mission"
      </h2>
      <div className="h-0.5 w-full bg-gray-300 mb-2" />
      <table className="border-2 border-collapse mt-6" style={{ width: "100%" }}>
        <thead className="bg-blue-50">
          <tr>
            <th className="border-2 p-2"></th>
            {facultyMissionKeywords.map((keyword, index) => (
              <th key={index} className="border-2 p-2 " style={{ width: "16%" }}>
                {keyword}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {programMissionKeywords.map((keyword, rowIndex) => (
            <tr key={rowIndex} className="border-2">
              <td className="border-2 p-2 bg-blue-50" style={{ width: "20%" }}>{keyword}</td>
              {facultyMissionKeywords.map((_, colIndex) => (
                <td key={colIndex} className="border-2 p-2 text-center" style={{ width: "16%" }}>
                  {matrix[rowIndex][colIndex] ? "✓" : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RelationshipMatrixTable;
