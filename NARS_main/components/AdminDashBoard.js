import Link from "next/link";
import { useRouter } from "next/router";
import { header } from "./header";
import { userActions } from "./store/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { CgProfile, CgScreen  } from "react-icons/cg";
import { CgLogOut } from "react-icons/cg";
import { GiTeacher } from "react-icons/gi";
import { FaUniversity } from "react-icons/fa";
import { TiGroupOutline } from "react-icons/ti";

export default function AdminDashBoard() {
  const router = useRouter();
  const navStatus = useSelector((s) => s.user.navStatus);
  const userState = useSelector((s) => s.user);
  const dispatch = useDispatch();
  
  const {modalOpen}=userState

  const logoutHandler = () => {
    router.push('/logout')

    //window.location.href = "/logout";
  };
  return (
    <nav
      className="nav2"
    >
      <Link className="link2 focus:text-green-400 " href="/profile">
        <div className="text-center text-4xl text-indigo-900">
          NARQA
        </div>
      </Link>
      <Link className="link2focus:text-green-400 " href="/profile">
        <span>
          <CgProfile
            style={{ fontSize: 30, display: "inline", marginBottom: 5 }}
          />
        </span>
        <span className="ml-2">Profile</span>
      </Link>
      <Link className="link2 focus:text-green-400 " href="/HomeDash">
        <span>
          <i class="fa-solid fa-chart-simple text-3xl"></i>
        </span>
        <span className="ml-2">Dash Board</span>
      </Link>
      <Link className="link2 focus:text-green-400 " href="/admin/faculty/viewfaculty">
            <span>
            <FaUniversity
              style={{
                fontSize: 30,
                display: "inline",
                marginBottom: 4,
                marginRight: 9,
              }}
            />
            View Faculties
          </span>
      </Link>
      <Link className="link2 focus:text-green-400 " href="/admin/department/viewDepartments">
        <span>
            <i class="fa-solid fa-layer-group text-3xl"></i>
        </span>
        <span className="ml-2">
          View Departments
        </span>
      </Link>
      
      
      {header(
        <span>
          <TiGroupOutline
            style={{
              fontSize: 30,
              display: "inline",
              marginBottom: 4,
              marginRight: 9,
            }}
          />
          Staff
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
              Add Department Admin
            </Link>,
            <Link
            className={
              router.pathname === "/admin/staff/addProgramAdmin"
                ? "activeLinkDashboard2"
                : "normalLinkDashboard2"
            }
            href="/admin/staff/addProgramAdmin"
          >
            Add Program Admin
          </Link>,
            <Link
            className={
              router.pathname === "/admin/staff/addQualityCoordinator"
                ? "activeLinkDashboard2"
                : "normalLinkDashboard2"
            }
            href="/admin/staff/addQualityCoordinator"
          >
            Add Quality coordinator
          </Link>,
          <Link
          className={
            router.pathname === "/admin/staff/addInstructor"
              ? "activeLinkDashboard2"
              : "normalLinkDashboard2"
          }
          href="/admin/staff/addInstructor"
        >
          Add Instructor
        </Link>,
      //     <Link
      //     className={
      //       router.pathname === "/admin/staff/updateStaff"
      //         ? "activeLinkDashboard2"
      //         : "normalLinkDashboard2"
      //     }
      //     href="/admin/staff/updateStaff"
      //   >
      //     Update Staff
      //   </Link>,
      //   <Link
      //   className={
      //     router.pathname === "/admin/staff/delteStaff"
      //       ? "activeLinkDashboard2"
      //       : "normalLinkDashboard2"
      //   }
      //   href="/admin/staff/deleteStaff"
      // >
      //   Delete Staff
      // </Link>,
          
          <Link
            className={
              router.pathname === "/admin/staff/view-all"
                ? "activeLinkDashboard2"
                : "normalLinkDashboard2"
            }
            href="/admin/staff/view-all"
          >
            Show all staffs
          </Link>,
          // <Link
          //   className={
          //     router.pathname === "/admin/staff/search-staff"
          //       ? "activeLinkDashboard2"
          //       : "normalLinkDashboard2"
          //   }
          //   href="/admin/staff/search-staff"
          // >
          //   Search
          // </Link>,
      //     <Link
      //       className={
      //         router.pathname === "/admin/staff/staffroles"
      //           ? "activeLinkDashboard2"
      //           : "normalLinkDashboard2"
      //       }
      //       href="/admin/staff/staffroles"
      //     >
      //       Add roles
      //     </Link>,
      //     <Link
      //       className={
      //         router.pathname === "/admin/staff/removeroles"
      //           ? "activeLinkDashboard2"
      //           : "normalLinkDashboard2"
      //       }
      //       href="/admin/staff/removeroles"
      //     >
      //       Remove roles
      //     </Link>,
        ]
      )}


      <button
        className="link2 focus:text-green-400 text-left"
        onClick={logoutHandler}
      >
        <span>
          <CgLogOut
            style={{ fontSize: 30, display: "inline", marginBottom: 0 }}
          />
        </span>
        <span className="ml-2">Logout</span>
      </button>
    </nav>
  );
}
