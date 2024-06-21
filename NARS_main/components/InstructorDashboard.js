import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { CgProfile, CgLogOut } from "react-icons/cg";
import { BsBook } from "react-icons/bs";
import { GrAddCircle, GrOrderedList } from "react-icons/gr";
import { updateField } from "./store/userSlice";
import HeaderElement from "./HeaderElement";
import { header } from "./header";
import { TiGroupOutline } from "react-icons/ti";
import Cookies from "js-cookie";
import { FaChalkboardTeacher } from 'react-icons/fa';
import { FaFileAlt } from 'react-icons/fa';
import { FaPlusCircle } from 'react-icons/fa';
import { FaBook } from 'react-icons/fa'; // Ensure this import matches the icon library you're using








export default function InstructorDashboard({ cookies }) {
  const [courses, setCourses] = useState([]);
  const coursesRef = useRef([]);
  const router = useRouter();
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const { _id: userId, token } = userState;
  const navStatus = useSelector((state) => state.user.navStatus);

  useEffect(() => {
    getCreatedCoursesForInstructor();
  }, [userId, token]);

  const getCreatedCoursesForInstructor = async () => {
    try {
      const response = await fetch(
        `http://localhost:8087/created-courses?instructor=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data = await response.json();
      setCourses(data.data);
    } catch (error) {
      console.error("Error fetching courses:", error.message);
      // Handle error - display message to user, retry mechanism, etc.
    }
  };

  const logoutHandler = () => {
    router.push("/logout");
  };

  return (
    <nav
      className={`instructorNav transition-all duration-300 transform max-h-screen overflow-auto ${
        navStatus ? "-translate-x-full" : "translate-x-0"
      }`}
    >
      <Link className="link2 focus:text-green-400 " href="/profile">
        <div className="text-center text-4xl text-indigo-900">
          NARQA
        </div>
      </Link>
      <Link className="link2font-semibold" href="/profile">
        <div className="flex items-center">
          <CgProfile style={{ fontSize: 40, marginBottom: 5, }} />
          <span className="ml-2 text-lg">Profile</span>
        </div>
      </Link>

      {/* <div className="mt-4">
        <h2 className="text-lg text-gray-700 mb-2">Courses</h2>
        <ul className="space-y-2">
          {courses.map((courseInstance) => (
            <li key={courseInstance._id}>
              <HeaderElement
                className={``}
                key={courseInstance._id}
                id={courseInstance._id}
                originalId={courseInstance.course._id}
                name={courseInstance.course.name}
                createdAt={courseInstance.createdAt.split("T")[0]}
                cookies={cookies}
              />
            </li>
          ))}
        </ul>
      </div> */}
     

      <Link className="link2  font-semibold" href="/instructor/courses/create">
        <div className="flex items-center mt-4">
        
<FaChalkboardTeacher style={{ fontSize: 30, marginBottom: 5 }} />

         
          <span className="ml-2 text-lg">Create Course</span>
        </div>
      </Link>
      
      {header(
        <span>
          <i class="fa-solid fa-user-graduate text-2xl mr-2"></i>

          Assessment
        </span>,
        [
          <Link className="link2  font-semibold" href="/indirectAssessment/assessment">
          <div className="flex items-center mt-4">
          
            <span className=" text-lg mb-1">Create Assessment</span>
          </div>
         </Link>,
            <Link
              
            href={{ pathname: `/indirectAssessment/updateassessment`, query: { role: "isInstructor" } }}
            >
              Update Assessment
            </Link>,
            // <Link
            //   className={
            //     router.pathname === "/admin/staff/addDepartmentAdmin"
            //       ? "activeLinkDashboard2"
            //       : "normalLinkDashboard2"
            //   }
            //   href="/admin/staff/addDepartmentAdmin"
            // >
            //   LO with Assessments
            // </Link>,
        ]
      )}
      {header(
       <span style={{ display: "flex", alignItems: "center" }}>
       <FaPlusCircle style={{ fontSize: 30, marginBottom: 5, marginRight: 5 }} />
       <span>Topic</span>
     </span>
     ,
        [
          <Link className="link2  font-semibold" href="/indirectAssessment/topics">
          <div className="flex items-center mt-1">
          
            <span className="text-lg">Create Topics</span>
          </div>
        </Link>,
            <Link
              
            href={{ pathname: `/indirectAssessment/updatetopic`, query: { role: "isInstructor" } }}
            >
              View Topic
            </Link>,
            // <Link
            //   className={
            //     router.pathname === "/admin/staff/addDepartmentAdmin"
            //       ? "activeLinkDashboard2"
            //       : "normalLinkDashboard2"
            //   }
            //   href="/admin/staff/addDepartmentAdmin"
            // >
            //   LO with Assessments
            // </Link>,
        ]
      )}
     


    
      <Link
        className="link2   font-semibold"
        href={{ pathname: `/indirectAssessment/grade`, query: { role: "isInstructor" } }}
      >
        <div className="flex items-center mt-4">
         <FaFileAlt style={{ fontSize: 30, marginBottom: 5 }} />
          <span className="ml-2 text-lg"> Marks</span>
        </div>
      </Link>

      <Link
        className="link2   font-semibold"
        href={{ pathname: `/indirectAssessment/surveys`, query: { role: "isInstructor" } }}
      >
        <div className="flex items-center mt-4">
        <FaPlusCircle style={{ fontSize: 30, marginBottom: 5 }} />
          {/* <GrOrderedList style={{ fontSize: 30, marginBottom: 5, x}} /> */}
          <span className="ml-2 text-lg">Surveys</span>
        </div>
      </Link>

      {header(
        <span>
          <i class="fa-solid fa-user-graduate text-2xl mr-2"></i>

          Student
        </span>,
        [
            <Link
              
            href={{ pathname: `/indirectAssessment/addstudent`, query: { role: "isInstructor" } }}
            >
              Add Student
            </Link>,
            <Link
              
            href={{ pathname: `/indirectAssessment/viewstudents`, query: { role: "isInstructor" } }}
            >
              view Students
            </Link>,
            // <Link
            //   className={
            //     router.pathname === "/admin/staff/addDepartmentAdmin"
            //       ? "activeLinkDashboard2"
            //       : "normalLinkDashboard2"
            //   }
            //   href="/admin/staff/addDepartmentAdmin"
            // >
            //   LO with Assessments
            // </Link>,
        ]
      )}
      {header(
        <span>
          <i class="fa-solid fa-signal text-2xl mr-2"></i>
          Learngin Outcomes
        </span>,
        [
            <Link
              className={
                router.pathname === "/admin/staff/addDepartmentAdmin"
                  ? "activeLinkDashboard2"
                  : "normalLinkDashboard2"
              }
              href="/admin/staff/addDepartmentAdmin"
            >
              LO with competences
            </Link>
           
        ]
      )}
      <Link
  className="link2 font-semibold"
  href={{ pathname: `/indirectAssessment/coursespecs`, query: { role: "isInstructor" } }}
>
  <div className="flex items-center mt-4">
    <FaBook style={{ fontSize: 30, marginBottom: 5 }} />
    {/* <GrOrderedList style={{ fontSize: 30, marginBottom: 5, x}} /> */}
    <span className="ml-2 text-lg">Course specs</span>
  </div>
</Link>
<Link className="link2  font-semibold" href="/indirectAssessment/comp">
        <div className="flex items-center mt-4">
        
<FaChalkboardTeacher style={{ fontSize: 30, marginBottom: 5 }} />

         
          <span className="ml-2 text-lg">Competences</span>
        </div>
      </Link>
<Link
        className="link2   font-semibold"
        href={{ pathname: `/indirectAssessment/flowchart`, query: { role: "isInstructor" } }}
      >
        <div className="flex items-center mt-4">
        <FaPlusCircle style={{ fontSize: 30, marginBottom: 5 }} />
          {/* <GrOrderedList style={{ fontSize: 30, marginBottom: 5, x}} /> */}
          <span className="ml-2 text-lg">FlowChart</span>
        </div>
      </Link>


      <button className="link2   text-left mt-4 font-semibold" onClick={logoutHandler}>
        <div className="flex items-center">
          <CgLogOut style={{ fontSize: 30, marginBottom: 0, }} />
          <span className="ml-2 text-lg">Logout</span>
        </div>
      </button>
    </nav>
  );
}
