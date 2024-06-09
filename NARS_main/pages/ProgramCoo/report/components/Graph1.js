import React from "react";

const RelationshipMatrixTable = () => {
  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="font-bold text-xl mt-8">Professional Information</h2>
      <div className="h-0.5 w-full bg-gray-300 mb-2" />
      <div className="w-full mt-6">
        <h3 className="font-bold text-lg">Statistics:</h3>
        <p>No. of students enrolled in the 4 academic years of the programme: 277</p>
        <h3 className="font-bold text-lg mt-4">Number of students and percentage of success</h3>
        <table className="border-2 border-collapse w-full mt-2">
          <thead>
            <tr>
              <th className="border-2 p-2">Academic year</th>
              <th className="border-2 p-2">No. Student</th>
              <th className="border-2 p-2">Success Percentage %</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-2 p-2">First year</td>
              <td className="border-2 p-2">83</td>
              <td className="border-2 p-2">98.7%</td>
            </tr>
            <tr>
              <td className="border-2 p-2">Second year</td>
              <td className="border-2 p-2">98</td>
              <td className="border-2 p-2">94.9%</td>
            </tr>
            <tr>
              <td className="border-2 p-2">Third year</td>
              <td className="border-2 p-2">56</td>
              <td className="border-2 p-2">94.64%</td>
            </tr>
            <tr>
              <td className="border-2 p-2">Fourth year</td>
              <td className="border-2 p-2">42</td>
              <td className="border-2 p-2">100%</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-2">*The total No. of Preparatory year (585) is divided among all Faculty departments.</p>

        <p className="mt-4">Direction of joining the program in proportion to the numbers entrants’ program during the last three years: Increasing Constant Decreasing</p>
        <p>No. of students who fulfilled the program and their percentage to those who were enrolled (see above table)</p>
        <h3 className="font-bold text-lg mt-4">Grading: in terms of number of students and percentage</h3>
        <table className="border-2 border-collapse w-full mt-2">
          <thead>
            <tr>
              <th className="border-2 p-2">Academic year</th>
              <th className="border-2 p-2">Grade</th>
              <th className="border-2 p-2">No. Student</th>
              <th className="border-2 p-2">Percentage %</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-2 p-2">First Year</td>
              <td className="border-2 p-2">Excellent</td>
              <td className="border-2 p-2">52</td>
              <td className="border-2 p-2">62.65%</td>
            </tr>
            <tr>
              <td className="border-2 p-2">Very good</td>
              <td className="border-2 p-2">28</td>
              <td className="border-2 p-2">33.73%</td>
            </tr>
            <tr>
              <td className="border-2 p-2">Good</td>
              <td className="border-2 p-2">1</td>
              <td className="border-2 p-2">1.2%</td>
            </tr>
            <tr>
              <td className="border-2 p-2">Pass</td>
              <td className="border-2 p-2">0</td>
              <td className="border-2 p-2">0%</td>
            </tr>
            <tr>
              <td className="border-2 p-2">Failed in one or two subjects</td>
              <td className="border-2 p-2">1</td>
              <td className="border-2 p-2">1.2%</td>
            </tr>
            <tr>
              <td className="border-2 p-2">Failed in more than two subjects</td>
              <td className="border-2 p-2">1</td>
              <td className="border-2 p-2">1.2%</td>
            </tr>
          </tbody>
        </table>
        <table className="border-2 border-collapse w-full mt-2">
          <thead>
            <tr>
              <th className="border-2 p-2">Academic year</th>
              <th className="border-2 p-2">Grade</th>
              <th className="border-2 p-2">No. Student</th>
              <th className="border-2 p-2">Percentage %</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-2 p-2">Second Year</td>
              <td className="border-2 p-2">Excellent</td>
              <td className="border-2 p-2">12</td>
              <td className="border-2 p-2">12.24%</td>
            </tr>
            <tr>
              <td className="border-2 p-2">Very good</td>
              <td className="border-2 p-2">62</td>
              <td className="border-2 p-2">63.26%</td>
            </tr>
            <tr>
              <td className="border-2 p-2">Good</td>
              <td className="border-2 p-2">13</td>
              <td className="border-2 p-2">13.26%</td>
            </tr>
            <tr>
              <td className="border-2 p-2">Pass</td>
              <td className="border-2 p-2">0</td>
              <td className="border-2 p-2">0%</td>
            </tr>
            <tr>
              <td className="border-2 p-2">Failed in one or two subjects</td>
              <td className="border-2 p-2">6</td>
              <td className="border-2 p-2">6.12%</td>
            </tr>
            <tr>
              <td className="border-2 p-2">Failed in more than two subjects</td>
              <td className="border-2 p-2">5</td>
              <td className="border-2 p-2">5.1%</td>
            </tr>
          </tbody>
        </table>
        <table className="border-2 border-collapse w-full mt-2">
          <thead>
            <tr>
              <th className="border-2 p-2">Academic year</th>
              <th className="border-2 p-2">Grade</th>
              <th className="border-2 p-2">No. Student</th>
              <th className="border-2 p-2">Percentage %</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-2 p-2">Third Year</td>
              <td className="border-2 p-2">Excellent</td>
              <td className="border-2 p-2">15</td>
              <td className="border-2 p-2">26.78%</td>
            </tr>
            <tr>
              <td className="border-2 p-2">Very good</td>
              <td className="border-2 p-2">28</td>
              <td className="border-2 p-2">50%</td>
            </tr>
            <tr>
              <td className="border-2 p-2">Good</td>
              <td className="border-2 p-2">9</td>
              <td className="border-2 p-2">16.07%</td>
            </tr>
            <tr>
              <td className="border-2 p-2">Pass</td>
              <td className="border-2 p-2">0</td>
              <td className="border-2 p-2">0%</td>
            </tr>
            <tr>
              <td className="border-2 p-2">Failed in one or two subjects</td>
              <td className="border-2 p-2">1</td>
              <td className="border-2 p-2">1.78%</td>
            </tr>
            <tr>
              <td className="border-2 p-2">Failed in more than two subjects</td>
              <td className="border-2 p-2">3</td>
              <td className="border-2 p-2">5.35%</td>
            </tr>
          </tbody>
        </table>
        <table className="border-2 border-collapse w-full mt-2">
          <thead>
            <tr>
              <th className="border-2 p-2">Academic year</th>
              <th className="border-2 p-2">Grade</th>
              <th className="border-2 p-2">No. Student</th>
              <th className="border-2 p-2">Percentage %</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-2 p-2">Fourth Year</td>
              <td className="border-2 p-2">Excellent</td>
              <td className="border-2 p-2">13</td>
              <td className="border-2 p-2">29.54%</td>
            </tr>
            <tr>
              <td className="border-2 p-2">Very good</td>
              <td className="border-2 p-2">24</td>
              <td className="border-2 p-2">54.54%</td>
            </tr>
            <tr>
              <td className="border-2 p-2">Good</td>
              <td className="border-2 p-2">5</td>
              <td className="border-2 p-2">11.36%</td>
            </tr>
            <tr>
              <td className="border-2 p-2">Pass</td>
              <td className="border-2 p-2">0</td>
              <td className="border-2 p-2">0%</td>
            </tr>
            <tr>
              <td className="border-2 p-2">Failed in one or two subjects</td>
              <td className="border-2 p-2">2</td>
              <td className="border-2 p-2">0%</td>
            </tr>
            <tr>
              <td className="border-2 p-2">Failed in more than two subjects</td>
              <td className="border-2 p-2">0</td>
              <td className="border-2 p-2">4.54%</td>
            </tr>
          </tbody>
        </table>

        <h3 className="font-bold text-lg mt-4">Employment of graduates:</h3>
        <p>(WE, Vodafone, Eisalat Misr, Huwaei, Valeo, BlueCloud Technologies, Higher Education universities and Institutes, Military Factories, Egyptair, ABB, Hewlett-Packard, Binladin Group, National Air Navigation Services Company)</p>
      </div>

      <h2 className="font-bold text-xl mt-8">Academic Standards</h2>
      <div className="h-0.5 w-full bg-gray-300 mb-2" />
      <div className="w-full mt-6">
        <h3 className="font-bold text-lg">1. Academic Reference Standards of Program:</h3>
        <p>The Faculty of Engineering at Shoubra has adopted the National Academic Reference Standard, NARS, Prepared by NAQAAE (National Authority for Quality Assurance and Accreditation of Education), issued 2018</p>
        <h3 className="font-bold text-lg mt-4">a. Level A Competences:</h3>
        <ul className="list-disc pl-6">
          <li>Identify, formulate, and solve complex engineering problems by applying engineering fundamentals, basic science and mathematics.</li>
          <li>Develop and conduct appropriate experimentation and/or simulation, analyze and interpret data, assess and evaluate findings, and use statistical analyses and objective engineering judgment to draw conclusions.</li>
          <li>Apply engineering design processes to produce cost-effective solutions that meet specified needs with consideration for global, cultural, social, economic, environmental, ethical and other aspects as appropriate to the discipline and within the principles and contexts of sustainable design and development.</li>
          <li>Utilize contemporary technologies, codes of practice and standards, quality guidelines, health and safety requirements, environmental issues and risk management principles.</li>
        </ul>
      </div>
    </div>
  );
};

export default RelationshipMatrixTable;
