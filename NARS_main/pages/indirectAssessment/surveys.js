import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { updateField } from "@/components/store/userSlice";

const CreateSurvey = ({ cookies }) => {
  const userState = useSelector((s) => s.user);
  //New logic
  const [course, setCourse] = useState('');
  const [courses, setCourses] = useState([]);
  const [questions, setQuestions] = useState([{ text: '', rating: '' }]);
  const [overallRating, setOverallRating] = useState('');
  const [responseId, setResponseId] = useState();

  //Sumbit Handlgin states
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const closeMsg = () => {
    setMsg("");
  };


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

  const submitHandler = async (e) => {
    e.preventDefault();
    const temp = course.split("-");
    const courseId = temp[0];
    const courseName = temp[1];

    console.log({
      courseId,
      courseName,
      questions,
      overallRating,
    });

    try {
      const r = await fetch(`http://localhost:8082/`, {
        method: "POST",

        body: JSON.stringify({
          courseId,
          courseName,
          questions,
          overallRating,
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + userState.token,
        },
      });

      const resp = await r.json();
      setResponseId(resp.surveyId);

      console.log(resp);

      if (!resp.surveyId) {
        setErr(resp.error);
        console.log(resp, err);
        setMsg(fail);
      }
      else {
        setMsg(success);
        console.log(resp);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: '', rating: '' }]);
  };

  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index].text = event.target.value;
    setQuestions(newQuestions);
  };

  const handleRatingChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index].rating = event.target.value;
    setQuestions(newQuestions);
  };

  let fail = (
    <div
      id="alert-border-2"
      class="flex p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800"
      role="alert"
    >
      <i class="fa-sharp fa-solid fa-circle-exclamation"></i>
      <div class="ml-3 text-lg font-medium">
        Failed to create survey
        <a href="#" class="font-semibold underline hover:no-underline"></a>.
      </div>
      <button
        type="button"
        onClick={closeMsg}
        class="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
        data-dismiss-target="#alert-border-2"
        aria-label="Close"
      >
        <span class="sr-only">Dismiss</span>
        <svg
          aria-hidden="true"
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  );

  let success = (
    <div
      id="alert-border-3"
      class="flex p-4 mb-4 text-green-800 border-t-4 border-green-300 bg-green-50 dark:text-green-400 dark:bg-gray-800 dark:border-green-800"
      role="alert"
    >
      <i class="fa-solid fa-circle-check"></i>
      <div class="ml-3 text-lg font-medium">
        Survey has been Created successfully 
        
      </div>
      <button
        onClick={closeMsg}
        type="button"
        class="ml-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
        data-dismiss-target="#alert-border-3"
        aria-label="Close"
      >
        <span class="sr-only">Dismiss</span>
        <svg
          aria-hidden="true"
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  );




  //View
  return (
    <div className="flex flex-row min-h-screen mt-5 mb-5">
       <form 
       onSubmit={submitHandler}
       className=" min-h-screen w-screen flex flex-col justify-center items-center text-black"
       >
      <div className="contentAddsurvey min-h-screen flex flex-col gap-10 overflow-auto">
        <h2 className="font-bold  mb-6 text-3xl text-center">Create a Survey</h2>
          <div className="w-full mx-auto">
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Select a Course:</label>
            <select
              className="choose-form w-full p-2 border rounded"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
            >
              <option value="">Select Course</option>
              {courses.map((e) => {
              return <option value={`${e.id}-${e.name}`}>{e.name}</option>;
              })}{" "}
            </select>
          </div>
          {questions.map((question, index) => (
            <div key={index} className="my-8 border-2 p-5">
              <label className="block mb-2 font-semibold">Question:</label>
              <input
                required
                type="text"
                className="w-full p-2 border rounded input-form "
                value={question.text}
                onChange={(e) => handleQuestionChange(index, e)}
              />
              <label className="block mt-2 mb-2 font-semibold">Rating:</label>
              <select
                required
                className="choose-form w-full p-2 border rounded"
                value={question.rating}
                onChange={(e) => handleRatingChange(index, e)}
              >
                <option value="">Select Rating</option>
                <option value="3">3</option>
                <option value="5">5</option>
                
              </select>
            </div>
          ))}

          <button
            className="w-full py-2 mb-4 bg-blue-500 text-white rounded"
            onClick={handleAddQuestion}
          >
            Add Question
          </button>

          <div className="mb-4">
            <label className="block mb-2 font-semibold">Overall Rating of the Course:</label>
            <select
                required
                className="choose-form w-full p-2 border rounded"
                value={overallRating}
                onChange={(e) => setOverallRating(e.target.value)}
              >
                <option value="">Select Rating</option>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="10">10</option>
              </select>
          </div>
          
          <div className="flex gap-20 p-5 w-full">
              {<div className="mt-10 w-[1/2]">{msg}</div>}
          </div>
          {responseId &&
          <div className="flex gap-20 p-5 w-full">
            <div className="w-[1/2]">
              <div
                id="alert-border-3"
                class="flex p-4 mb-4 text-green-800 border-t-4 border-green-300 bg-green-50 dark:text-green-400 dark:bg-gray-800 dark:border-green-800"
                role="alert"
              >
                <i class="fa-solid fa-circle-check"></i>
                <div class="ml-3 text-lg font-medium">
                <p>link:</p>
                <Link className="link2 focus:text-green-400 " href={`http://localhost:3000/indirectAssessment/${responseId}/ViewSurvey`}>
                  http://localhost:3000/indirectAssessment/{`${responseId}`}/ViewSurvey
                </Link>
                  
                </div>
                <button
                  onClick={closeMsg}
                  type="button"
                  class="ml-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
                  data-dismiss-target="#alert-border-3"
                  aria-label="Close"
                >
                  <span class="sr-only">Dismiss</span>
                  <svg
                    aria-hidden="true"
                    class="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          }

          <div className="flex justify-end">
              <button
                type="submit"
                class="w-[6rem]  text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm md:text-lg px-5 py-2.5 mx-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Create
              </button>
          </div>

        </div>
        </div>
       </form>
       
    </div>
  );

  
};

export default CreateSurvey;
