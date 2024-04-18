import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import UserList from "@/components/user/UserList2";
import OneUser from "./OneUser";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";
const viewAll = ({ cookies }) => {
  const userState = useSelector((s) => s.user);
  if (userState.role != "system admin" || userState.loggedInStatus != "true") {
    return <div className="error">404 could not found</div>;
  }
 
  const [view, setView] = useState(false);
  const [onestaff, setOnestaff] = useState({});

  console.log("onestaff", onestaff)

  const handleClick = () => {
    const header = ["name", "roles", "email","faculty","department","program"];
    const rows = staff.map((item) => [item.name, item.roles.join(", "), item.email,"Shoubra","Electrical Engineering","Computer engineering"]);

    const worksheet = XLSX.utils.aoa_to_sheet([header, ...rows]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const fileBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const file = new Blob([fileBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(file, "staff.xlsx");
  };

  console.log(userState.token);
  const router = useRouter();
  const [staff, setStaff] = useState([]);
  useEffect(() => {
    submitHandler();
  }, []);
  const submitHandler = async (e) => {
    if (e) {
      e.preventDefault();
    }
    try {
      const resp = await fetch('http://localhost:8081/staff', {
        headers: {
          Authorization: "Bearer " + userState.token,
        },
      });
      const data = await resp.json();
      console.log("data.data:", data.data);
      let arr = data.data.staff;

      arr = arr.map((e) => {
        return { email: e.email, name: e.name, roles: e.roles ,faculty:e.faculty,department:e.department,program:e.program, id: e._id};
      });
      setStaff(arr);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div className="flex flex-row h-screen mt-5 mb-5">
        <form
          onSubmit={submitHandler}
          className="h-screen w-screen flex flex-col justify-center items-center text-black ml-1 rounded-2xl"
          >
          <div className="contentAddUser2 overflow-auto flex flex-col gap-10">
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-center text-blue-800 mb-6 mt-4">List of all Staff</p>
              <button
                onClick={handleClick}
                className="transition-all duration-200 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Download Excel
              </button>
            </div>
            {view ? 
              <OneUser user={onestaff} setView={setView} setOnestaff={setOnestaff}/>
            // <p>One</p>
              :
              <UserList users={staff} setView={setView} setOnestaff={setOnestaff}/>
            }
          </div>
        </form>
      </div>
    </>
  );
};

export default viewAll;
