import { useEffect, useState, useRef } from "react";
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

  //New states
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState({});
  const coursesList = useRef();

  useEffect(() => {
    async function getCourses() {
      const d = await fetch(`http://localhost:8087/original-courses`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + cookies.token,
        },
      });

      const data = await d.json();
      let a = data.data.map((e) => {
        return { name: e.name, id: e._id, code: e.code };
      });
      console.log("courses from server:",  a);
      setCourses(a);
    }
    getCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedCourse((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };



  const handleCourseChange = async () => {
    const selectedFacultyId = coursesList.current.value;
    console.log(selectedFacultyId);


    let tempArray = [];

    const resp = await fetch(
      `http://localhost:8087/original-courses/${selectedFacultyId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userState.token,
        },
      }
    );

    const data = await resp.json();
    
    if(!data.data) return

    const Onecourse = data.data;

    console.log("Course details from server:", Onecourse);
    setTimeout(() => {
      setSelectedCourse(Onecourse);
    }, 500);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // try {
    //   const response = await fetch("http://localhost:8087/created-courses", {
    //     method: "POST",
    //     body: JSON.stringify(courseData),
    //     headers: {
    //       "Content-Type": "application/json",
    //       Accept: "application/json",
    //       Authorization: `Bearer ${userState.token}`,
    //     },
    //   });
    //   const data = await response.json();
    //   console.log(data);
    //   // Optionally, redirect the user to another page after successful submission
    //   router.push("/dashboard"); // Change "/dashboard" to the appropriate route
    // } catch (error) {
    //   console.error("Error creating course: ", error);
    // }
    console.log("selectedCourse", selectedCourse)
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
          <select
            ref={coursesList}
            id="small"
            class="choose-form w-full px-10"
            onChange={handleCourseChange}
          >
            <option className="text-left" disabled selected>
              Choose a Course
            </option>
            {courses.map((e) => {
              return <option value={e.id}>{e.name}</option>;
            })}{" "}
          </select>
            

            <label htmlFor="code" className="text-form font-bold">
              Course Code:
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={selectedCourse.code}
              onChange={handleChange}
              className="input-field"
            />

            <label htmlFor="information" className="text-form font-bold">
            Course Aims:
            </label>
            <textarea
              id="information"
              name="information"
              value={courseData.information}
              onChange={handleChange}
              className="input-field"
              rows="4"
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
