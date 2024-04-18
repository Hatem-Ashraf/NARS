import { userActions } from "../components/store/userSlice";
import { updateField } from "../components/store/userSlice";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import MainHeader from "@/components/shared/MainHeader";
import LoginModal from "@/components/LoginModal";
import { translate } from "pdf-lib";

export default function Login({ cookies }) {
  const s = useSelector((s) => s.user);
  console.log(s);
  const email = useRef();
  const password = useRef();
  const role = useRef();
  const dispatch = useDispatch();
  const [invalidData, setInvalidData] = useState(false);
  const [rolesArr, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const submitHandler = async (e) => {
    e.preventDefault();
    const r = await fetch('http://localhost:8081/login', {
      method: "POST",

      body: JSON.stringify({
        email: email.current.value,
        password: password.current.value,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const resp = await r.json();
    console.log(resp);
    if (resp.status == "fail") {
      setInvalidData(true);
    } else {
      const courses = JSON.stringify(resp.data.user.courses);
      dispatch(userActions.toggleLoggedIn(true));
      dispatch(updateField({ field: "courses", value: courses }));
      dispatch(updateField({ field: "loggedInStatus", value: "true" }));
      dispatch(updateField({ field: "_id", value: resp.data.user._id }));
      dispatch(updateField({ field: "email", value: resp.data.user.email }));
      dispatch(updateField({ field: "jwt", value: resp.token }));
      dispatch(updateField({ field: "token", value: resp.token }));
      dispatch(updateField({ field: "name", value: resp.data.user.name }));
      dispatch(updateField({ field: "faculty", value: resp.data.user.faculty }));
      dispatch(updateField({ field: "department", value: resp.data.user.department }));
      dispatch(
        updateField({ field: "program", value: resp.data.user.program })
      );
      if (resp.data.user.role === "student") {
        dispatch(updateField({ field: "role", value: resp.data.user.role }));
        router.push("/studentProfile");
      } else if (resp.data.user.roles.length <= 1) {
        dispatch(
          updateField({ field: "role", value: resp.data.user.roles[0] })
        );
        router.push("/profile");
      } else {
        setRoles(resp.data.user.roles);
        setShowModal(true);
      }
    }
  };
  const submitRole = async (e) => {
    if (e) {
      e.preventDefault();
    }
    dispatch(updateField({ field: "role", value: role.current.value }));
    router.push("/profile");
  };
  return (
    <div className="mt-5" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`
        body {
          background-color: #012a4a;
          font-family: Arial, sans-serif;
        }
      `}</style>
      {/* <MainHeader /> */}
      <div style={{ display: "flex", justifyContent: "between", }} >
       
      <div style={{ 
  background: "#023e7d",
  borderRadius: "20px",
  borderTopRightRadius: "120px",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
  width: "600px",
  margin: "auto", // Center horizontally
  marginTop: "80px", // Add margin from the top
  padding: "30px",
  height: "320px",
  position:"relative",
  transform:"translate(8%,50%)",
  
}}>
  <div className="flex justify-center items-center h-full ">
    <p className=" font-bold text-white text-center p-4 text-2xl">
      Welcome to NARQA, a competency-based quality assurance system tailored for higher education programs, especially in computer systems engineering.
    </p>
  </div>
</div>

<div className="flex  justify-center h-screen mb-8">
  <div style={{ 
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    width: "700px",
    marginRight: "20px",
  }}>
    <div className="flex flex-col justify-center items-center gap-8 w-full mt-10 text-blue-900 font-bold">
  <div className=" text-3xl font-bold"> Welcome to Login Page  </div>
  <form
    onSubmit={submitHandler}
    className=" px-5 py-10 w-[600px] max-w-full"
  >
    <div className="mb-4">
      <label htmlFor="email" className="block text-lg font-semibold text-gray-800 mb-2">
        Email
      </label>
      <input
        type="email"
        id="email"
        name="email"
        className="input-field w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        placeholder="Enter your email"
        required
        ref={email}
      />
    </div>
    <div className="mb-6">
      <label htmlFor="password" className="block text-lg font-semibold text-gray-800 mb-2">
        Password
      </label>
      <input
        type="password"
        id="password"
        name="password"
        className="input-field w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        placeholder="Enter your password"
        required
        ref={password}
      />
    </div>
    <div className="flex items-center justify-center">
      <button type="submit" className="w-[50%] py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
        Login
      </button>
    </div>
    <div className="mt-8 text-center">
      <p className="text-sm">
        Don't have an account?{" "}
        <Link href="/register" className="text-blue-500 hover:underline">
          Register now
        </Link>
      </p>
    </div>
    {invalidData && (
      <span className="text-red-500 block mt-4">Wrong email or password</span>
    )}
     <p className="text-sm text-center mt-8">
    Forgot your password?{" "}
    <Link href="/forget_password" className="text-blue-500 hover:underline">
      Reset now
    </Link>
  </p>
  <h1 className="text-blue-600 text-center mt-10 text-2xl">OR login with social media</h1>
  <div className="flex justify-center items-center mt-12 space-x-4">
  {/* Replace "fa-facebook" and "fa-twitter" with actual icon classes */}
  <a href="#" className="text-blue hover:text-blue-500 text-3xl mr-5"><i className="fab fa-facebook fa-lg"></i></a>
  <a href="#" className="text-blue text-3xl hover:text-blue-500"><i className="fab fa-twitter fa-lg"></i></a>
  <a href="#" className="text-blue text-3xl hover:text-blue-500"><i className="fab fa-google fa-lg"></i></a>

  {/* Add more social media icons as needed */}
</div>
  </form>
  
 
 
 
</div>

  </div>
</div>

      </div>
      <LoginModal isVisible={showModal} onClose={() => setShowModal(false)}>
        <div className="py-6 px-6 lg:px-8 text-left">
          <h3 className="mb-4 text-xl font-medium text-gray-900">
            Select your role
          </h3>
          <form className="space-y-6" onSubmit={submitRole}>
            <select
              ref={role}
              id="small"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm
              rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
            >
              <option selected>Choose a role</option>
              {rolesArr.map((e, index) => {
                return <option key={index} value={e}>{e}</option>;
              })}{" "}
            </select>
            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800
            focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium
            rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Confirm
            </button>
          </form>
        </div>
      </LoginModal>
    </div>
  );
}

Login.getPageLayout = function PageLayout(page) {
  return <div className=" flex flex-col">{page}</div>;
};
