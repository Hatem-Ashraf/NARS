import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

function Competences({ competences }) {
  const userState = useSelector((s) => s.user);

  return (
    <div className="container mt-10">
      <table className="w-full text-left border rounded">
        <thead className="bg-sky-100">
          <tr className="text-xl">
            <th className="px-4 text-xl py-2 font-bold border">Code</th>
            <th className="px-4 text-xl py-2 font-bold border">Description</th>
          </tr>
        </thead>
        <tbody>
          {competences && competences.length > 0 ? (
            competences.map((comp) => (
              <tr key={comp.code}>
                <td className="border text-xl px-4 py-2 bg-white">{comp.code}</td>
                <td className="border text-xl px-4 py-2 bg-white">{comp.description}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border text-xl px-4 py-2 bg-white" colSpan="2">
                No competences found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

Competences.propTypes = {
  competences: PropTypes.array.isRequired,
};

export default Competences;
