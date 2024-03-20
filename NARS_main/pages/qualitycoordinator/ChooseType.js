import React, { useState } from 'react';
import Link from 'next/link';

const ButtonWithHoverEffect = ({ text, description, icon, goto }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={goto} className='w-3/5'>
        <button
          className="relative transition duration-300 transform hover:scale-105 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className='text-6xl mb-5'>
            <i className={icon}></i>
          </div>
          <p className='text-4xl'>
            {text}
          </p>
          {isHovered && (
            <div className="mt-5 bg-indigo-200 text-lg text-gray-800 py-2 px-4 rounded shadow-lg">
              {description}
            </div>
          )}
        </button>
    </Link>
  );
};

const MyComponent = () => {
  return (
    <div className='h-screen'>
      <div className="flex justify-center mt-10 w-[90%] mx-auto ">
        <ButtonWithHoverEffect goto="/qualitycoordinator/view-all-level-A" text="Faculty Competencies" description="Some description for Faculty Competencies Some description for Faculty Competencies. Some description for Faculty Competencies." icon="fa-solid fa-building-columns" />
        <ButtonWithHoverEffect goto="/qualitycoordinator/AddLevelB" text="Department Competencies" description="Some description for Department Competencies." icon="fa-solid fa-layer-group" />
        <ButtonWithHoverEffect goto="/qualitycoordinator/AddLevelC" text="Program Competencies" description="Some description for Program Competencies." icon="fa-solid fa-newspaper" />
      </div>
    </div>
  );
};

export default MyComponent;
