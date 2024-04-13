import Link from "next/link";
import React from "react";
import PropTypes from "prop-types";
import ShowRolesButton from "./ShowRolesButton";


function UserList({ users, handleAssignInstructor }) {

  const handleAssign = (user) => {
    console.log("Assigning instructor for user:", user);
  };

  return (
    <div className="container mx-auto my-4">
      <table className="w-full text-left border rounded">
        <thead className="bg-sky-100">
          <tr>
            <th className="px-4 py-2 font-bold border text-lg">Name</th>
            <th className="px-4 py-2 font-bold border text-lg">Roles</th>
            <th className="px-4 py-2 font-bold border text-lg">Email</th>
            <th className="px-4 py-2 font-bold border text-lg">Faculty</th>
            <th className="px-4 py-2 font-bold border text-lg">Department</th>
            <th className="px-4 py-2 font-bold border text-lg">Program</th>
            <th className="px-4 py-2 font-bold border text-lg">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            return (
              <tr key={user.email}>
                <td className="border px-4 py-2 text-lg">{user.name}</td>
                <td className="border px-4 py-2 text-lg">
                  <ShowRolesButton roles={user.roles}/>
                </td>
                <td className="border px-4 py-2 text-lg">{user.email}</td>
                <td className="border px-4 py-2 text-lg">Shoubra</td>
                <td className="border px-4 py-2 text-lg">Electrical Engineering</td>
                <td className="border px-4 py-2 text-lg">Computer engineering</td>
                <td className="border px-4 py-2">
                <Link href={`/ProgramCoo/updateinstructor/${user.id}`}>
                <button 
                      onClick={() => handleAssign(user)} 
                      className="flex justify-between min-w-[10rem] text-white duration-200 transition-all bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg py-1 px-4 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Assign Instructor
                    </button>
                </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

}

UserList.propTypes = {
  users: PropTypes.array.isRequired,
  handleAssignInstructor: PropTypes.func.isRequired,
  handleAssign: PropTypes.func.isRequired,
};

export default UserList;
