import React from "react";
import PropTypes from "prop-types";

function UserList({ users }) {

  return (
    <div className="container my-4 ">
      <table className="w-full text-left border rounded">
        <thead className="bg-sky-100">
          <tr className="text-xl">
            <th className="px-4 text-xl py-2 font-bold border">Name</th>
            <th className="px-4 text-xl py-2 font-bold border">Code</th>
            <th className="px-4 text-xl py-2 font-bold border">Head Of Department</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            return (
              <tr key={user.email}>
                <td className="border text-xl px-4 py-2 bg-white">Civil Engineering</td>
                <td className="border text-xl px-4 py-2 bg-white">105</td>
                <td className="border text-xl px-4 py-2 bg-white">hatem195301@bhit.bu.edu.eg</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


export default UserList;
