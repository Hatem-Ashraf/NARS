import React, { useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { useSelector } from "react-redux";

function Competences({ competences, setCompetences,handleCheckboxChange, level, delete_url, create_file_name }) {
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
      console.log(`${delete_url}${competenceIdToDelete}`)
      const response = await fetch(`${delete_url}${competenceIdToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + userState.token,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete competence');
      }
  
      const resp = await response.json();
      console.log("Response:", resp);
  
      const newCompetences = competences.filter((comp) => comp._id !== competenceIdToDelete);
      setCompetences(newCompetences);
  
      // Close the modal
      setShowModal(false);
      setCompetenceIdToDelete(null);
    } catch (error) {
      console.error("Error deleting competence:", error);
      // Optionally handle error, display a message to the user, etc.
    }
  };
  

  return (
    <div className="container my-4 ">
      
  <fieldset>
    <legend className="sr-only">Checkboxes</legend>
    <div className="space-y-2">
    {competences.map((el, index) => {
        return (
      <label
        key={index + 1}
        htmlFor={index}
        className="flex shadow-lg cursor-pointer items-start gap-4 bg-white rounded-lg border border-gray-200 p-4 transition hover:bg-gray-200 has-[:checked]:bg-blue-50"
      >
        <div className="flex items-center">
          &#8203;
          <input type="checkbox" className="size-4 rounded border-gray-300" id={index} 
          value={el._id}
          data-id={index}
          onChange={handleCheckboxChange}
          />
        </div>

        <div>
          <strong className="font-medium text-gray-900"> {el.code} </strong>

          <p className="mt-1 text-pretty text-medium text-gray-500">
          {el.description}.
          </p>
        </div>
      </label>
        )
      })}
    </div>
  </fieldset>
    </div>
  );
}

Competences.propTypes = {
  competences: PropTypes.array.isRequired,
  level: PropTypes.string.isRequired,
};

export default Competences;
