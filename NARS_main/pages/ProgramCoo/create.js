import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { updateField } from "@/components/store/userSlice";

const CreateCourse = ({ cookies }) => {
  const userState = useSelector((s) => s.user);
  const router = useRouter();
  const [courseData, setCourseData] = useState({
    title: "",
    code: "",
    instructor: cookies._id,
    hours: "",
    information: "",
    goals: "",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch any necessary data or perform any setup here
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8087/created-courses", {
        method: "POST",
        body: JSON.stringify(courseData),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userState.token}`,
        },
      });
      const data = await response.json();
      console.log(data);
      // Optionally, redirect the user to another page after successful submission
      router.push("/dashboard"); // Change "/dashboard" to the appropriate route
    } catch (error) {
      console.error("Error creating course: ", error);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`
        body {
          background-color: rgb(243 244 246);
          font-family: Arial, sans-serif;
        }
      `}</style>
      <div className="mt-5  flex justify-center min-h-screen">
      <div className=" p-20 max-w-3xl bg-gray-100 w-full shadow-2xl rounded-3xl">
        <h2 className="font-bold text-form mb-4 text-3xl text-center">Create a Course</h2>
        <form onSubmit={submitHandler}>
          <div className="flex flex-col gap-4 ">
          <label htmlFor="title" className="text-form font-bold w-1/3">Course Title:</label>
          <input
              type="text"
              id="title"
              name="title"
              value={courseData.title}
              onChange={handleChange}
              className="input-field focus:border-gray-400 focus:outline-none flex-grow"
              required
            />
            

            <label htmlFor="code" className="text-form font-bold">
              Course Code:
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={courseData.code}
              onChange={handleChange}
              className="input-field"
              required
            />

            <label htmlFor="hours" className="text-form font-bold">
              Hours:
            </label>
            <input
              type="text"
              id="hours"
              name="hours"
              value={courseData.hours}
              onChange={handleChange}
              className="input-field"
              required
            />

            <label htmlFor="information" className="text-form font-bold">
              Specific Course Information:
            </label>
            <textarea
              id="information"
              name="information"
              value={courseData.information}
              onChange={handleChange}
              className="input-field"
              rows="4"
              required
            ></textarea>

            <label htmlFor="goals" className="text-form font-bold">
              Specific Goals of the Course:
            </label>
            <textarea
              id="goals"
              name="goals"
              value={courseData.goals}
              onChange={handleChange}
              className="input-field"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-6 mt-12 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
            >
              Create Course
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
   
  );
};

export default CreateCourse;
