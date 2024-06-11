import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { updateField } from "@/components/store/userSlice";

const CreateCourse = ({ cookies }) => {
  const userState = useSelector((s) => s.user);
  const router = useRouter();

  // Some rendering hooks
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // New states
  const [selectedCourse, setSelectedCourse] = useState({
    name: "",
    code: "",
    courseAims: "",
    courseInformation: "",
    program: "",
    hours: "",
  });

  const closeMsg = () => {
    setMsg("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedCourse((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8087/newCourse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
        body: JSON.stringify({
          name: selectedCourse.name,
          code: selectedCourse.code,
          courseAims: selectedCourse.courseAims,
          courseInformation: selectedCourse.courseInformation,
          program: userState.program,
          hours: selectedCourse.hours,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        setMsg(fail);
      } else {
        const data = await response.json();
        console.log('Success response:', data);
        setMsg(success);
      }
    } catch (error) {
      console.error('Error creating course:', error);
      setMsg(fail);
    }
  };

  let fail = (
    <div
      id="alert-border-2"
      className="flex p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800"
      role="alert"
    >
      <i className="fa-sharp fa-solid fa-circle-exclamation"></i>
      <div className="ml-3 text-lg font-medium">
        Failed to Submit Course
        <a href="#" className="font-semibold underline hover:no-underline"></a>.
      </div>
      <button
        type="button"
        onClick={closeMsg}
        className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
        data-dismiss-target="#alert-border-2"
        aria-label="Close"
      >
        <span className="sr-only">Dismiss</span>
        <svg
          aria-hidden="true"
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 011.414 1.414L11.414 10l4.293 4.293a1 1 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  );

  let success = (
    <div
      id="alert-border-3"
      className="flex p-4 mb-4 text-green-800 border-t-4 border-green-300 bg-green-50 dark:text-green-400 dark:bg-gray-800 dark:border-green-800"
      role="alert"
    >
      <i className="fa-solid fa-circle-check"></i>
      <div className="ml-3 text-lg font-medium">
        Course has been created successfully
        <a href="#" className="font-semibold underline hover:no-underline"></a>
      </div>
      <button
        onClick={closeMsg}
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
        data-dismiss-target="#alert-border-3"
        aria-label="Close"
      >
        <span className="sr-only">Dismiss</span>
        <svg
          aria-hidden="true"
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 111.414 1.414L11.414 10l4.293 4.293a1 1 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 01-1.414-1.414L8.586 10 4.293 5.707a1 1 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  );

  return (
    <div className="flex flex-row min-h-screen mt-5 mb-5">
      <form onSubmit={submitHandler} className="min-h-screen w-screen flex flex-col justify-center items-center text-black">
        <div className="mt-5 w-[70%] flex justify-center min-h-screen">
          <div className="p-20 bg-gray-100 w-full shadow-2xl rounded-3xl">
            <h2 className="font-bold text-form mb-4 text-3xl text-center">Course Details</h2>
            <div className="flex flex-col gap-4 ">
              {/* Course Title Input */}
              <label htmlFor="name" className="text-form font-bold">
                Course Title:
              </label>
              <input
                placeholder="Course Title"
                type="text"
                id="name"
                name="name"
                value={selectedCourse.name}
                onChange={handleChange}
                className="input-field border-1 border-gray-800"
              />

              {/* Course Code Input */}
              <label htmlFor="code" className="text-form font-bold">
                Course Code:
              </label>
              <input
                placeholder="Course Code"
                type="text"
                id="code"
                name="code"
                value={selectedCourse.code}
                onChange={handleChange}
                className="input-field border-1 border-gray-800"
              />

              {/* Course Aims Textarea */}
              <label htmlFor="courseAims" className="text-form font-bold">
                Course Aims:
              </label>
              <textarea
                placeholder="Course Aims"
                id="courseAims"
                name="courseAims"
                value={selectedCourse.courseAims}
                onChange={handleChange}
                className="input-field border-1 border-gray-800"
                rows="4"
              ></textarea>

              {/* Course Information Textarea */}
              <label htmlFor="courseInformation" className="text-form font-bold">
                Course Information:
              </label>
              <textarea
                placeholder="Course Information"
                id="courseInformation"
                name="courseInformation"
                value={selectedCourse.courseInformation}
                onChange={handleChange}
                className="input-field border-1 border-gray-800"
                rows="4"
              ></textarea>

              {/* Course Hours Input */}
              <label htmlFor="hours" className="text-form font-bold">
                Course Hours:
              </label>
              <input
                placeholder="Course Hours"
                type="number"
                id="hours"
                name="hours"
                value={selectedCourse.hours}
                onChange={handleChange}
                className="input-field border-1 border-gray-800"
              />
            </div>

            {/* Message Display Area */}
            <div className="flex gap-20 mt-10">
              <div className="w-3/4 mt-10 mx-auto">{msg}</div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="px-6 mt-12 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCourse;