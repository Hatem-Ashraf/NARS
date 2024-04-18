import React from "react";
import PropTypes from "prop-types";
import ShowRolesButton from "./ShowRolesButton";
import Link from "next/link";

function UserList({ users, setView, setOnestaff }) {
    console.log(users);

    function handleView (staff) {
        setView(true);
        setOnestaff(staff)
    }
    
  return (
    <div className="container mx-auto my-4">
      <table className="w-full text-left border rounded">
        <thead className="bg-sky-100">
          <tr>
            <th className="px-4 py-2 font-bold border text-lg">Name</th>
            <th className="px-4 py-2 font-bold border text-lg">Role</th>
            <th className="px-4 py-2 font-bold border text-lg">Email</th>
            {/* <th className="px-4 py-2 font-bold border text-lg">Faculty</th>
            <th className="px-4 py-2 font-bold border text-lg">Department</th>
            <th className="px-4 py-2 font-bold border text-lg">Program</th> */}
            <th className="px-4 py-2 font-bold border text-lg text-center">View</th>
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
                <td className="border flex justify-center px-4 py-2 text-lg">
                  <button onClick={() => handleView(user)}>
                      <i class="fa-solid fa-eye text-2xl text-indigo-800"></i>
                  </button>
                </td>
                {/* <td className="border px-4 py-2 text-lg">{user.faculty}</td>
                <td className="border px-4 py-2 text-lg">{user.department}</td>
                <td className="border px-4 py-2 text-lg">{user.program}</td> */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


export default UserList;
