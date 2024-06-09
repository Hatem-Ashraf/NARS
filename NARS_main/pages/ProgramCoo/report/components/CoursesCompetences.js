import React from "react";

const RelationshipMatrixTable = () => {

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="font-bold text-xl mt-8">Program Structure</h2>
      <div className="h-0.5 w-full bg-gray-300 mb-2" />
      <table className="border-2 border-collapse w-full mt-6">
        <tbody>
          <tr>
            <td className="border-2 p-2">No. of Credit hours</td>
            <td className="border-2 p-2">175</td>
          </tr>
          <tr>
            <td className="border-2 p-2">Credit hours system</td>
            <td className="border-2 p-2">
              <div>119 Lectures</div>
              <div>163 Compulsory</div>
              <div>56 Tutorial/Labs</div>
              <div>12 Elective</div>
            </td>
          </tr>
          <tr>
            <td className="border-2 p-2">No. of Credit hours of social science and humanities</td>
            <td className="border-2 p-2">16 hours = 9.14%</td>
          </tr>
          <tr>
            <td className="border-2 p-2">No. of Credit hours of mathematics and basic science</td>
            <td className="border-2 p-2">42 hours = 24%</td>
          </tr>
          <tr>
            <td className="border-2 p-2">No. of Credit hours of basic Engineering science</td>
            <td className="border-2 p-2">40 hours = 22.85%</td>
          </tr>
          <tr>
            <td className="border-2 p-2">No. of Credit hours of applied Engineering and design</td>
            <td className="border-2 p-2">35 hours = 20%</td>
          </tr>
          <tr>
            <td className="border-2 p-2">No. of Credit hours of computer application and ICT</td>
            <td className="border-2 p-2">16 hours = 9.14%</td>
          </tr>
          <tr>
            <td className="border-2 p-2">No. of Credit hours of project and practice</td>
            <td className="border-2 p-2">14 hours = 8%</td>
          </tr>
          <tr>
            <td className="border-2 p-2">No. of Credit hours of Discretionary (Institution character-identifying) subjects</td>
            <td className="border-2 p-2">12 hours = 6.86%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RelationshipMatrixTable;
