import React, { useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { useSelector } from "react-redux";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

function departmentList({ faculties, setFaculties, delete_url, create_file_name }) {
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
  
      const newfaculties = faculties.filter((comp) => comp.id !== competenceIdToDelete);
      setFaculties(newfaculties);
  
      // Close the modal
      setShowModal(false);
      setCompetenceIdToDelete(null);
    } catch (error) {
      console.error("Error deleting faculty:", error);
      // Optionally handle error, display a message to the user, etc.
    }
  };
  

  return (
    <div className="container my-4 ">
      <table className="w-full text-left border rounded">
        <thead className="bg-sky-100">
          <tr className="text-xl">
            <th className="px-4 text-xl py-2 font-bold border">Name</th>
            {/* <th className="px-4 text-xl py-2 font-bold border">Dean</th>
            <th className="px-4 text-xl py-2 font-bold border">About</th> */}
            <th className="px-4 text-xl py-2 font-bold border">Action</th>
          </tr>
        </thead>
        <tbody>
          {faculties.map((fac) => {
            return (
              <tr key={fac.code}>
                <td className="border text-xl px-4 py-2 bg-white">{fac.name}</td>
                {/* <td className="border text-xl px-4 py-2 bg-white">{fac.dean}</td>
                <td className="border text-xl px-4 py-2 bg-white">{fac.about}</td> */}
                <td className="border text-lg py-5 bg-white">
                  <div className="flex justify-around">
                    <Link href={`/department/updatedepartment/${fac.id}`}>
                      <i className="fa-solid fa-pen text-indigo-700"></i>
                    </Link>
                    <button onClick={() => handleDelete(fac.id, fac.name)}>
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
        <Link href={`/department/addprogram`} className="bg-green-600 p-2 rounded text-white text-xl font-bold">
          <span>Add Program
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
