import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ShowRolesButton from "./ShowRolesButton";
import Link from "next/link";
import { useSelector } from "react-redux";


function UserList({ user, setView, setOnestaff }) {
    const userState = useSelector((s) => s.user);

    const [additionalData, setAdditionalData] = useState({});

    const userRole = user.roles.includes("system admin") ? "system admin" : user.roles[0];

    useEffect(() => {
        // Function to fetch additional data for each ID
        const fetchData = async () => {
            const additionalColumns = {
                "quality coordinator": ["faculty"],
                "department admin": ["faculty", "department"],
                "program admin": ["faculty", "program", "department"],
                "instructor": ["faculty", "program", "department"]
            };

            const userRole = user.roles.includes("system admin") ? "system admin" : user.roles[0];

            if (additionalColumns[userRole]) {
                const columnPromises = additionalColumns[userRole].map(async column => {
                    try {
                        // console.log("column", column);
                        if (column === "faculty") {
                            const response = await fetch(`http://localhost:8083/${user.faculty}`,{
                              headers: {
                                Authorization: "Bearer " + userState.token,
                              },
                            });
                            const data = await response.json();
                            console.log("data from fetch", data.data.name);
                            return { [column]: data.data.name }; // Assuming the fetched data is an object
                        }
                        else if (column === "department") {
                            const response = await fetch(`http://localhost:8084/${user.department}`,{
                              headers: {
                                Authorization: "Bearer " + userState.token,
                              },
                            });
                            const data = await response.json();
                            console.log("data from fetch", data.data.name);
                            return { [column]: data.data.name }; // Assuming the fetched data is an object
                        }
                        else if (column === "program") {
                            const response = await fetch(`http://localhost:8086/${user.faculty}/department/${user.department}/program/${user.program}`,{
                              headers: {
                                Authorization: "Bearer " + userState.token,
                              },
                            });
                            const data = await response.json();
                            console.log("data from fetch", data.data.program.name);
                            return { [column]: data.data.program.name }; // Assuming the fetched data is an object
                        }
                    } catch (error) {
                        console.error(`Error fetching data for ${column}:`, error);
                        return null;
                    }
                });

                // Wait for all requests to complete
                const columnData = await Promise.all(columnPromises);
                const newData = {};

                // Store fetched data in state
                columnData.forEach(item => {
                    if (item) {
                        const key = Object.keys(item)[0];
                        newData[key] = item[key];
                    }
                });
                console.log("newData", newData);
                console.log("columnData", columnData);
                setAdditionalData(newData);
            }
        };

        fetchData();
    }, [user]); // Trigger the effect whenever the user object changes

    function handleView(staff) {
        setView(false);
        // setOnestaff(staff)
    }

    const headers = [
        <th key="name" className="px-4 py-2 font-bold border text-lg">Name</th>,
        <th key="role" className="px-4 py-2 font-bold border text-lg">Role</th>,
        <th key="email" className="px-4 py-2 font-bold border text-lg">Email</th>
    ];

    const additionalColumns = {
        "quality coordinator": ["faculty"],
        "department admin": ["faculty", "department"],
        "program admin": ["faculty", "department", "program"],
        "instructor": ["faculty", "department", "program"]
    };

    if (additionalColumns[userRole]) {
        additionalColumns[userRole].forEach((column, index) => {
            headers.push(
                <th key={index} className="px-4 py-2 font-bold border text-lg">{column}</th>
            );
        });
    }

    return (
        <div className="container mx-auto my-4">
            <table className="w-full text-left border rounded">
                <thead className="bg-sky-100">
                    <tr>
                        {headers}
                        <th className="px-4 py-2 font-bold border text-lg text-center">View</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border px-4 py-2 text-lg">{user.name}</td>
                        <td className="border px-4 py-2 text-lg">
                            <ShowRolesButton roles={user.roles} />
                        </td>
                        <td className="border px-4 py-2 text-lg">{user.email}</td>
                        {additionalColumns[userRole]?.map((column, index) => (
                            <td key={index} className="border px-4 py-2 text-lg">
                                {additionalData[column] ? additionalData[column] : "Not found"}
                            </td>
                        ))}

                        <td className="border flex justify-center px-4 py-2 text-lg">
                            <button onClick={() => handleView(user)}>
                                <i className="fa-solid fa-eye-slash text-2xl text-indigo-800"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

UserList.propTypes = {
    user: PropTypes.object.isRequired,
    setView: PropTypes.func.isRequired,
    setOnestaff: PropTypes.func.isRequired
};

export default UserList;
