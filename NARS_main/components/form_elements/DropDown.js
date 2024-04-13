// components/Dropdown.js
import { useState } from 'react';

const Dropdown = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="px-4 py-2 text-gray-800 rounded-md bg-gray-200 hover:bg-gray-300 focus:outline-none focus:bg-gray-300"
      >
        Dropdown
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-2 w-48 bg-white border rounded-md shadow-lg">
          <ul>
            {items.map((item, index) => (
              <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
