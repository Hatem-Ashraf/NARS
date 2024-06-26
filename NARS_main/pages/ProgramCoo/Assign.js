import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";
import UserList from "@/components/user/UserList3";
import PropTypes from "prop-types";


const assignInstructor = ({ cookies }) => {
  const userState = useSelector((s) => s.user);
  
  useEffect(() => {
    submitHandler();
  }, []);

  const handleClick = () => {
    const header = ["name", "roles", "email", "faculty", "department", "program"];
    const rows = staff.map((item) => [item.name, item.roles.join(", "), item.email, "Shoubra", "Electrical Engineering", "Computer engineering"]);

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

      arr = arr.filter((user) => user.roles.includes("instructor")).map((user) => ({
        email: user.email,
        name: user.name,
        roles: user.roles,
        faculty: user.faculty,
        department: user.department,
        program: user.program,
        id: user._id,
      }));
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
              <p className="text-3xl font-bold text-center text-blue-800 mb-6 mt-4">List of all Instructors</p>
              <button
                onClick={handleClick}
                className="transition-all duration-200 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Download Excel
              </button>
            </div>

            <UserList users={staff} />
          </div>
        </form>
      </div>
    </>
  );
};

export default assignInstructor;

              // students.map((s) => {
              //   return (
              //     <div className=" w-full flex justify-between bg-sky-500 items-center shadow-md rounded-xl px-[2rem] text-white">
              //       {/* <img
              //         className="h-48 w-48 object-cover rounded-full mx-auto bg-gray-300"
              //         src="https://via.placeholder.com/400x400"
              //         alt="Default Image"
              //       /> */}
              //       <div className="">
              //         <i class="fa-solid fa-user fa-lg "></i>{' '}
              //       </div>
              //       <div className="flex flex-col">
              //         <div>Name : {s.name}</div>
              //         <div>Code : {s.code}</div>
              //         <div>Email : {s.email}</div>
              //       </div>
              //     </div>
              //   );
              // })
