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
import { RiFileList2Line } from "react-icons/ri";
import { FaBook } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";
import { FaFileAlt } from "react-icons/fa";
import { FaRegLightbulb } from "react-icons/fa";

import Cookies from "js-cookie";

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
      className={`instructorNav transition-all duration-300 transform ${
        navStatus ? "-translate-x-full" : "translate-x-0"
      }`}
    >
      <Link className="link2 focus:text-green-400 " href="/profile">
        <div className="text-center text-4xl text-indigo-900">NARQA</div>
      </Link>
      <Link className="link2font-semibold" href="/profile">
        <div className="flex items-center">
          <CgProfile style={{ fontSize: 40, marginBottom: 5 }} />
          <span className="ml-2 text-lg">Profile</span>
        </div>
      </Link>

      {header(
        <span>
          <i className="fa-solid fa-book text-2xl mr-2"></i>
          Courses
        </span>,
        [
          <Link
            className="link2 font-semibold"
            href="/instructor/courses/create"
          >
            <div className="flex items-center">
              <span className="text-lg">Add Course Info</span>
            </div>
          </Link>,
          <Link className="link2 font-semibold" href="/instructor/courses/LOs">
            <div className="flex items-center">
              <span className="text-lg">Add LOs</span>
            </div>
          </Link>,
          <Link
            className="link2 font-semibold"
            href={{
              pathname: "/indirectAssessment/surveys",
              query: { role: "isInstructor" },
            }}
          >
            <div className="flex items-center">
              <span className="text-lg">Create Surveys</span>
            </div>
          </Link>,
        ]
      )}

      {header(
        <span>
          <i className="fa-solid fa-user-graduate text-2xl mr-2"></i>
          Student
        </span>,
        [
          <Link
            href={{
              pathname: "/indirectAssessment/addstudent",
              query: { role: "isInstructor" },
            }}
          >
            Add Student
          </Link>,
          <Link
            href={{
              pathname: "/indirectAssessment/viewstudents",
              query: { role: "isInstructor" },
            }}
          >
            View Students
          </Link>,
          <Link
            className="link2 font-semibold"
            href={{
              pathname: "/indirectAssessment/grade",
              query: { role: "isInstructor" },
            }}
          >
            <div className="flex items-center">
              <span className="text-lg">Add Student Marks</span>
            </div>
          </Link>,
        ]
      )}

      {header(
        <div className="flex items-center">
          <FaFileAlt style={{ fontSize: "2rem", marginRight: "0.5rem" }} />
          <span>Assessment</span>
        </div>,
        [
          <Link
            className="link2 mt-3 font-semibold"
            href="/indirectAssessment/assessment"
          >
            <div className="flex items-center mt-4">
              <span className="text-lg mb-1">Create Assessment</span>
            </div>
          </Link>,
          <Link
            href={{
              pathname: "/indirectAssessment/updateassessment",
              query: { role: "isInstructor" },
            }}
          >
            Update Assessment
          </Link>,
        ]
      )}

      {header(
        <div className="flex items-center">
          <FaBook style={{ fontSize: 30, marginBottom: 5, marginRight: 5 }} />
          <span>Topic in Courses</span>
        </div>,
        [
          <Link
            className="link2 font-semibold"
            href="/indirectAssessment/topics"
          >
            <div className="flex items-center mt-1">
              <span className="text-lg">Create Topics</span>
            </div>
          </Link>,
          <Link
            href={{
              pathname: "/indirectAssessment/updatetopic",
              query: { role: "isInstructor" },
            }}
          >
            View Topic
          </Link>,
        ]
      )}

      <Link className="link2 font-semibold" href="/instructor/courses/LOvsComp">
        <div className="flex items-center mt-4">
          <FaPlusCircle style={{ fontSize: 30, marginBottom: 5 }} />
          <span className="ml-2 text-lg">LO vs competences</span>
        </div>
      </Link>

      <Link
        className="link2 font-semibold"
        href={{
          pathname: "/indirectAssessment/flowchart",
          query: { role: "isInstructor" },
        }}
      >
        <div className="flex items-center mt-4">
          <FaPlusCircle style={{ fontSize: 30, marginBottom: 5 }} />
          <span className="ml-2 text-lg">Charts</span>
        </div>
      </Link>

      <Link
        className="link2 font-semibold"
        href={{
          pathname: "/indirectAssessment/coursespecs",
          query: { role: "isInstructor" },
        }}
      >
        <div className="flex items-center mt-4">
          <FaBook style={{ fontSize: 30, marginBottom: 5 }} />
          <span className="ml-2 text-lg">Course Report</span>
        </div>
      </Link>

      <Link
        className="link2 focus:text-green-400 mt-4"
        href="/instructor/courses/CourseSpecs"
      >
        <span>
          <RiFileList2Line
            style={{ fontSize: 30, display: "inline", marginRight: 0 }}
          />
          <span className="ml-3">Course Specs</span>
        </span>
      </Link>

      <button
        className="link2 text-left mt-4 font-semibold"
        onClick={logoutHandler}
      >
        <div className="flex items-center">
          <CgLogOut style={{ fontSize: 30, marginBottom: 0 }} />
          <span className="ml-2 text-lg">Logout</span>
        </div>
      </button>
    </nav>
  );
}
