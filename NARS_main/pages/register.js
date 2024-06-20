import React, { useState, useRef } from "react"; // Import useRef
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { userActions } from "@/components/store/userSlice";
import Link from "next/link";

export default function Register() {
  const dispatch = useDispatch();
  const [notAdded, setNotAdded] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const router = useRouter();


  const onSubmit = async (data) => {
    const response = await fetch("http://localhost:8081/signup", {
      method: "POST",
      body: JSON.stringify({
        email: data.email
      }),
      headers: { "Content-Type": "application/json" },
    });
    const responseData = await response.json();
    if (response.status === 200) {
      dispatch(userActions.registerCompletionPart1());
      router.push("/otp");
    } else {
      setNotAdded(true);
    }
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative", display: "flex", flexDirection: "column" }}>
      <style>{`
        body {
          background-color: #012a4a;
          font-family: Arial, sans-serif;
          margin: 0;
        }
      `}</style>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" style={{ position: "absolute", bottom: 0, zIndex: -1, width: "100%" }}>
      <path fill="#0099ff" fill-opacity="1" d="M0,32L30,69.3C60,107,120,181,180,181.3C240,181,300,107,360,90.7C420,75,480,117,540,160C600,203,660,245,720,250.7C780,256,840,224,900,202.7C960,181,1020,171,1080,154.7C1140,139,1200,117,1260,112C1320,107,1380,117,1410,122.7L1440,128L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"></path>
      </svg>
      <div className="flex items-center justify-center m-0 ">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col mt-20 gap-5 p-8 border border-gray-300 rounded-lg shadow-xl px-5 py-10 w-[700px] max-w-full bg-white"
        >
          <h1 className="text-3xl font-bold text-blue-900 text-center">Create Your Account</h1>
          <div className="flex flex-col gap-5">
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
              {...register("email", {
                required: "Email is required",
              })}
            />
           </div>
          <button type="submit" className="btn-primary bg-blue-500 p-3 rounded-lg text-white ">
            Register
          </button>
          <p className="text-lg mt-5 text-gray-800 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
