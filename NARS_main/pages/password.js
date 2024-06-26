import React, { useState } from "react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
export default function password() {
  const [msg, setMsg] = useState(false);
  const completed = useSelector((s) => s.user.registerCompletionPart2);
  const info = useSelector((s) => s.user.info);
  const verifyCode = info.verifyCode;
  const submitHandler = async (e) => {
    e.preventDefault();

    const r = await fetch('http://localhost:8081/completeSignup', {
      method: "POST",
      body: JSON.stringify({
        verifyCode,
        password: input.password,
        passwordConfirm: input.confirmPassword,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const resp = await r.json();
    console.log(resp);
    if (resp.status != "success") {
      setMsg(false);
      alert(resp.message)
    } else {
      setMsg(true);
      Cookies.set("token", resp.token);

      //redirect to /login after 1.5 second
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    }
  };

  const [input, setInput] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({
    password: "",
    confirmPassword: "",
  });

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateInput(e);
  };

  const validateInput = (e) => {
    let { name, value } = e.target;
    setError((prev) => {
      const stateObj = { ...prev, [name]: "" };

      switch (name) {
        case "password":
          if (input.confirmPassword && value !== input.confirmPassword) {
            stateObj["confirmPassword"] =
              "Password and Confirm Password does not match.";
          } else {
            stateObj["confirmPassword"] = input.confirmPassword
              ? ""
              : error.confirmPassword;
          }
          break;

        case "confirmPassword":
          if (input.password && value !== input.password) {
            stateObj[name] = "Password and Confirm Password does not match.";
          }
          break;

        default:
          break;
      }

      return stateObj;
    });
  };
  if (completed) {
    return (
      <div class="flex flex-col gap-5 justify-center items-center w-full min-h-screen">
        <div className="text-2xl font-bold mt-20 mb-5"> </div>
        <form
          className="bg-gray-100 w-[25%] mb-10 flex flex-col gap-10 justify-center items-center text-1xl border-none border-black shadow-2xl rounded-2xl px-7 py-4"
          onSubmit={submitHandler}
        >
          <div className="flex flex-col gap-5">
            <label for="password" className="font-bold mr-10">
              password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="button"
              placeholder=""
              minLength="6"
              required
              value={input.password}
              onChange={onInputChange}
              onBlur={validateInput}
            ></input>
            {error.password && (
              <span className="text-red-500">{error.password}</span>
            )}
          </div>
          <div class="flex flex-col  mt-0">
            <label for="cnfrmPassword" className="font-bold ">
              confirmPassword
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="cnfrmPassword"
              className="button"
              placeholder=""
              required
              value={input.confirmPassword}
              onChange={onInputChange}
              onBlur={validateInput}
            ></input>
            {error.confirmPassword && (
              <span className="text-red-500">{error.confirmPassword}</span>
            )}
            {msg && (
            <span className="text-red-500">
              Successfully created an email
            </span>
            )}
          </div>
          <div className="mt-5 w-[50%] flex justify-center">
            <button
              type="submit"
              className="home-btn1 px-10 w-full"
              disabled={input.password !== input.confirmPassword}
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    );
  } else {
    return (
      <h1 className="flex justify-center items-center text-xl md:text-3xl w-screen ">
        404 Could not find page
      </h1>
    );
  }
}
