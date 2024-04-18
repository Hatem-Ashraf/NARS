import React from "react";
import Link from 'next/link';

function FacultyList({ faculties }) {
    console.log(faculties);

    return (
        <div className="container mx-auto my-4">
            <table className="w-full text-left  border rounded " >
                <thead className="bg-slate-200">
                    <tr>
                        <th rowSpan={2} className="text-lg px-4 py-2 font-bold border-indigo-500 border">Name</th>
                        <th rowSpan={2} className="text-lg px-4 py-2 font-bold border-indigo-500 border text-center">Dean</th>
                        <th rowSpan={2} className="text-lg px-4 py-2 font-bold border-indigo-500 border text-center">About</th>
                        <th colSpan={2}className="text-lg px-4 text-center border-indigo-500 border text-center py-2 font-bold">Competences</th>
                        <th rowSpan={2}className="text-lg px-4 py-2 font-bold border-indigo-500 border text-center">Action</th>
                    </tr>
                    <tr>
                        <th className="text-lg px-4 py-2 font-bold border-indigo-500 border text-center">Code</th>
                        <th className="text-lg px-4 py-2 font-bold border-indigo-500 border text-center">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {faculties.map((faculty) => {
                        return (
                            <tr key={faculty._id}>
                                <td className="border text-lg px-4 py-2">{faculty.name}</td>
                                <td className="border text-lg px-4 py-2">{faculty.dean}</td>
                                <td className="border text-lg px-4 py-2">{faculty.about}</td>
                                <td className="border text-lg px-4 py-2">
                                    <ul>
                                        {faculty.competences.map(comp => {
                                            return (
                                                <li key={comp._id}>{comp.code}</li>
                                            )
                                        })}
                                    </ul>
                                </td>
                                <td className="border text-lg px-4 py-2">
                                    <ul>
                                        {faculty.competences.map(comp => {
                                            return (<li key={comp._id}>{comp.description}</li>)
                                        })}
                                    </ul>
                                </td>
                                <td className="border text-lg px-4 py-2">
                                    <Link href={`/admin/faculty/updatefaculty/${faculty.id}`}>
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-2">Edit</button>
                                    </Link>
                                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">Delete</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default FacultyList;
