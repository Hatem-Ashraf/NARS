// components/Modal.js
import React from "react";

function Modal({ isOpen, onCancel, onConfirm, compCode }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Confirm Delete</h2>
        <p className="text-lg font-bold mb-4">Are you sure you want to delete?</p>
        <div className="flex justify-center">
          <button className="bg-gray-300 text-gray-700 py-2 px-4 mr-2 rounded" onClick={() => onCancel(compCode)}>Cancel</button>
          <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded" onClick={() => onConfirm(compCode)}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
