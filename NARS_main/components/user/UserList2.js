import React from "react";
import PropTypes from "prop-types";
import ShowRolesButton from "./ShowRolesButton";

function UserList({ users }) {
    console.log(users);

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
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


export default UserList;
