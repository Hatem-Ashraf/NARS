import React, { useState } from 'react';
import Link from 'next/link';

const ButtonWithHoverEffect = ({ text, description, icon, goto }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={goto} className='w-3/5'>
        <button
          className="relative transition h-[250px] w-[100%] duration-300 transform hover:scale-105 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
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
        <ButtonWithHoverEffect goto="/qualitycoordinator/view-all-level-A" text="Faculty Competences" 
        description={`
        Faculty competences refer to the skills, knowledge, and abilities required for faculty members (teachers, instructors, professors) to effectively perform their roles in educational institutions.
        These competences may include subject matter expertise, pedagogical skills, research abilities, communication skills, mentoring capabilities, and other attributes necessary for teaching, research, and academic leadership.

        `}
        icon="fa-solid fa-building-columns" />

        <ButtonWithHoverEffect goto="/qualitycoordinator/view-all-level-B" text="Department Competences" 
        description={`
        Department competences are the specific skills, knowledge areas, and capabilities required for the effective functioning and performance of a department within an organization or institution.
        These competences may include technical expertise related to the department's field or discipline, administrative skills, teamwork abilities, project management capabilities, communication skills, and problem-solving skills.
        `}
         icon="fa-solid fa-layer-group" />

        <ButtonWithHoverEffect goto="/qualitycoordinator/AddLevelC" text="Program Competences" description={`
          Program competences refer to the skills, knowledge domains, and proficiencies that students are expected to develop and demonstrate upon completion of an academic program or course of study.
          These competences are often aligned with the learning outcomes or educational objectives of the program and may encompass subject-specific knowledge, critical thinking skills, practical skills, ethical understanding, and other capabilities relevant to the program's Field or discipline.
        `}
         icon="fa-solid fa-newspaper" />
      </div>
    </div>
  );
};

export default MyComponent;
