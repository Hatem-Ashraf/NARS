import React from "react";

const LosDescriptionTable = () => {
  const basicInformation = [
    { label: "Program title", value: "Communication and Computer Engineering (CCE) Program" },
    { label: "Program Specialty", value: "Communication and Electronics Engineering and Computer Engineering" },
    { label: "Program duration", value: "10 semesters (5-years)" },
    { label: "Program structure", value: "Credit hours system" },
  ];

  const professionalInformation = [
    { label: "Faculty Mission", value: "The faculty of Engineering at Shoubra is committed to prepare a graduate with competencies and problem-solving skills that qualify each engineer to compete in local and regional labor markets." },
    { label: "Program Mission", value: "The Communications and Computer Engineering Program is committed to preparing a graduate who possesses the knowledge and skills that qualify him to compete in the labor market locally and regionally." },
  ];

  return (
    <>
      {basicInformation.length > 0 && professionalInformation.length > 0 && (
        <div className="flex flex-col items-center">
          <h2 className="font-bold text-xl mb-2">Basic Information Details</h2>
          <div className="h-0.5 w-full bg-gray-300 mb-2" />
          <div className="flex justify-between">
            {/* Left Table */}
            <table className="border-2 border-collapse mt-6" style={{ width: "49%" }}>
              <thead className="bg-blue-50">
                <tr>
                  <th className="border-2 p-4">Basic Information</th>
                  <th className="border-2 p-4" style={{ width: "75%" }}>
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {basicInformation.map((info, index) => (
                  <tr className="border-2" key={index}>
                    <td className="border-2 py-4 text-center bg-blue-50">{info.label}</td>
                    <td className="border-2 py-4 px-8">{info.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Right Table */}
            <table className="border-2 border-collapse mt-6" style={{ width: "49%" }}>
              <thead className="bg-blue-50">
                <tr>
                  <th className="border-2 p-4">Professional Information</th>
                  <th className="border-2 p-4" style={{ width: "75%" }}>
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {professionalInformation.map((info, index) => (
                  <tr className="border-2" key={index}>
                    <td className="border-2 py-4 text-center bg-blue-50">{info.label}</td>
                    <td className="border-2 py-4 px-8">{info.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default LosDescriptionTable;
