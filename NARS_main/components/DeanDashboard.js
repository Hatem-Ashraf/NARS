import Link from "next/link";
import { userActions } from "./store/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import HeaderElementProgramCoordinator from "./HeaderElementProgramCoordinator.js";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { header } from "./header";
import { useEffect, useState, useRef } from "react";
import { CgProfile } from "react-icons/cg";
import { CgLogOut } from "react-icons/cg";
import { GiTeacher } from "react-icons/gi";
import { GrAddCircle, GrOrderedList } from "react-icons/gr";
import { BsBook } from "react-icons/bs";
import { RiFileList2Line } from "react-icons/ri";
import generatePdf from 'pages/ProgramCoo/downloadSpecs.js';

export default function ProgramCoordinatorDashboard({ cookies }) {
  const [c, sC] = useState([]);
  const coursesRef = useRef([]);
  const r = useRouter();
  const userState = useSelector((s) => s.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const myFileInput = useRef(null);
  


  const logoutHandler = () => {
    r.push("/logout");
  };
  var file;
  useEffect(() => {
    console.log("Render");
  });




  const navStatus = useSelector((s) => s.user.navStatus);



  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <nav
      className={`nav2 transition-all duration-300 transform ${navStatus ? ` -translate-x-full` : `translate-x-0 `
        }`}
    >
       <Link className="link2 focus:text-green-400 " href="/profile">
        <div className="text-center text-4xl text-indigo-900">
          NARQA
        </div>
      </Link>
      <Link className="link2  focus:text-green-400 " href="/profile">
        <span>
          <CgProfile
            style={{ fontSize: 30, display: "inline", marginBottom: 5 }}
          />
        </span>
        <span className="ml-2">Profile</span>
      </Link>


      {header(
        <span>
          <RiFileList2Line
            style={{
              fontSize: 30,
              display: "inline",
              marginBottom: 4,
              marginRight: 9,
            }}
          />
          Program specs
        </span>,
        [
          <input
            type="file"
            className=""
            id="myFileInput"
            ref={myFileInput}
            onChange={async (e) => {
              setSelectedFile(e.target.files[0]);
              file=e.target.files[0];
              const data = new FormData();
              data.append("programSpcs", file);
              data.append("program", userState.program);

              try {
                const r = await fetch(
                  `http://localhost:8086/programSpcs`,
                  {
                    method: "POST",
                    body: data,
                    headers: {
                      Accept: "application/form-data",
                      Authorization: "Bearer " + userState.token,
                    },
                  }
                );

                const resp = await r.json();
                console.log(resp);
                console.log(selectedFile);
              } catch (e) {
                console.log(e);
              }
            }}
          />,
          <Link
          className={
            router.pathname === "/dean/report/programSpecs"
              ? "activeLinkDashboard2"
              : "normalLinkDashboard2"
          }
          href="/dean/report/programSpecs"
          >
          View program report
          </Link>,
          <Link
          className={
            router.pathname === ""
              ? "activeLinkDashboard2"
              : "normalLinkDashboard2"
          }
          href="#"
          onClick={(e) => {
            e.preventDefault();
            generatePdf();
          }}
          target="_blank"
          download
        >
          Download program specs
        </Link>,
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