import React from "react";

function ProgramList({ programs }) {
    console.log(programs);

    return (
        <div className="container mx-auto my-4">
            <table className="w-full text-left border rounded " >
                <thead className="bg-gray-100">
                    <tr>
                        <th className="w-2/6 px-4 py-2 font-bold border text-xl">Name</th>
                        <th className="px-4 py-2 font-bold border text-center text-xl">Competences</th>
                    </tr>
                </thead>
                <tbody>
                            <tr>
                                <td className="border text-xl px-4 py-2">Computer Engineering</td>
                                <td className="border text-xl px-4 py-2">
                                    <>
                                    <div className="block mt-2">Code:101</div>
                                    <div >Description:Apply a strong foundation in mathematics, science, and engineering principles to solve complex computer engineering problems.</div>
                                    <div className="block mt-4">Code:102</div>
                                    <div >Demonstrate proficiency in programming languages, algorithms, and data structures for software development and hardware design.</div>
                                    </>
                                </td>
                            </tr>
                </tbody>
            </table>
        </div>
    );
}


export default ProgramList;
