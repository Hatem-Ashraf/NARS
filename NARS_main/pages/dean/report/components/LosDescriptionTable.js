import React from "react";

const LosDescriptionTable = ({ facultyMission, programMission, programDuration, programStruc, programName, programSpec }) => {
  const basicInformation = [
    { label: "Program title", value: programName },
    { label: "Program Specialty", value: programSpec },
    { label: "Program duration", value: programDuration },
    { label: "Program structure", value: programStruc },
  ];

  const professionalInformation = [
    { label: "Faculty Mission", value: facultyMission},
    { label: "Program Mission", value: programMission},
  ];

  return (
    <>
      {basicInformation.length > 0 && professionalInformation.length > 0 && (
        <div className="flex flex-col items-center">
          <h2 className="font-bold text-xl mb-2">Basic Information Details</h2>
          <div className="h-0.5 w-full bg-gray-300 mb-2" />
          <div className="flex justify-between min-w-full">
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
