import React, { useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { useSelector } from "react-redux";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

function departmentList({ departments, setDepartments, delete_url, create_file_name }) {
  const userState = useSelector((s) => s.user);
  const [showModal, setShowModal] = useState(false);
  const [compCode, setCompCode] = useState("");
  const [competenceIdToDelete, setCompetenceIdToDelete] = useState(null);

  const handleDelete = (id, code) => {
    setCompetenceIdToDelete(id);
    setCompCode(id);
    setShowModal(true);
  };

  const handleCancelDelete = (comp_id) => {
    console.log("comp_id", comp_id)
    console.log("Cancel deleting competence with ID:", competenceIdToDelete);
    setShowModal(false);
  };

  const handleConfirmDelete = async (comp_id) => {
    console.log("comp_id", comp_id)
    try {
      console.log(`"url:",${delete_url}${competenceIdToDelete}`)
      const response = await fetch(`${delete_url}${competenceIdToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + userState.token,
        },
      });
  
      // if (!response.ok) {
      //   throw new Error('Failed to delete competence');
      // }
  
      // const resp = await response.json();
      // console.log("Response:", resp);
  
      const newdepartments = departments.filter((comp) => comp.id !== competenceIdToDelete);
      setDepartments(newdepartments);
  
      // Close the modal
      setShowModal(false);
      setCompetenceIdToDelete(null);
    } catch (error) {
      console.error("Error deleting department:", error);
      // Optionally handle error, display a message to the user, etc.
    }
  };
  

  return (
    <div className="container my-4 ">
      <table className="w-full text-left border rounded">
        <thead className="bg-sky-100">
          <tr className="text-xl">
            <th className="px-4 text-xl py-2 font-bold border">Name</th>
            <th className="px-4 text-xl py-2 font-bold border">Department Code</th>
            <th className="px-4 text-xl py-2 font-bold border">Head of Department</th>
            <th className="px-4 text-xl py-2 font-bold border">Vission</th>
            <th className="px-4 text-xl py-2 font-bold border">Mission</th>
            <th className="px-4 text-xl py-2 font-bold border">Action</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dep) => {
            return (
              <tr key={dep.code}>
                <td className="border text-xl px-4 py-2 bg-white">{dep.name}</td>
                <td className="border text-xl px-4 py-2 bg-white">{dep.code}</td>
                <td className="border text-xl px-4 py-2 bg-white">{dep.about}</td>
                <td className="border text-lg py-5 bg-white">
                  <div className="flex justify-around">
                    {/* <Link href={`/admin/faculty/updatefaculty/${fac.id}`}>
                      <i className="fa-solid fa-pen text-indigo-700"></i>
                    </Link> */}
                    <button onClick={() => handleDelete(dep.id, dep.name)}>
                      <i className="fa-solid fa-trash-can text-red-600"></i>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex justify-center mt-10 ">
        <Link href={`/admin/faculty/addfaculty`} className="bg-green-600 p-2 rounded text-white text-xl font-bold">
          <span>Add Faculty
            <i className="fa-solid fa-plus text-white ml-2"></i>
          </span>
        </Link>
      </div>

       {/* Modal for delete confirmation */}
       <DeleteConfirmationModal 
        isOpen={showModal} 
        onCancel={handleCancelDelete} 
        onConfirm={handleConfirmDelete} 
        compCode={compCode}
      />
    </div>
  );
}

// FacultyList.propTypes = {
//   competences: PropTypes.array.isRequired,
//   level: PropTypes.string.isRequired,
// };

export default departmentList;
