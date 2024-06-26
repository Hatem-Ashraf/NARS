
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { updateField } from "@/components/store/userSlice";

const CreateSurvey = ({ cookies }) => {
  const userState = useSelector((s) => s.user);
  const router = useRouter();
  const { surveyId } = router.query;

  console.log("surveyId", surveyId);


  //New logic
  const [course, setCourse] = useState('');
  const [courses, setCourses] = useState([]);

  const [questions, setQuestions] = useState([]);
  const [overallRating, setOverallRating] = useState('');

  const [overallRatingSelected, setOverallRatingselected] = useState('');
  const [questionsAnswers, setQuestionsAnswers] = useState([]);

  const [ratings, setRatings] = useState([]);

  //Sumbit Handling states
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");


  const closeMsg = () => {
    setMsg("");
  };


  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await fetch(`http://localhost:8082/${surveyId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + userState.token,
          },
      });
        const data = await response.json();
        console.log("res Data:", data);
        setCourse({name: data.data.courseName, Id: data.data.courseId});
        setQuestions(data.data.questions);
        setQuestionsAnswers(data.data.questions);
        setOverallRating(data.data.overallRating);
        let arr = data.data.questions.map(e => e.rating);
        setRatings(arr);
        console.log("ratings", ratings);

        if (data.status === "error") {
          setErr(data.message);
        }

      } catch (error) {
        console.error('Error fetching surveys:', error);
      }
    };
    fetchSurvey();

  }, [surveyId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const courseId = course.Id;
    const courseName = course.name;

    // { "surveyId": "661e7e4e35084432f6383a8a", "responses": [ { "questionId": "661e7e4e35084432f6383a8b", "response": 2 }, { "questionId": "661e7e4e35084432f6383a8c", "response": 4} ], "overallRating": 6 }
    
    const responses = questionsAnswers.map((question) => ({
      questionId: question._id,
      response: question.rating,
    }))

    console.log({
      surveyId,
      responses,
      overallRating: overallRatingSelected,
    });

    try {
      const r = await fetch(`http://localhost:8082/submissions/`, {
        method: "POST",
        body: JSON.stringify({
          surveyId,
          responses,
          overallRating: overallRatingSelected,
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + userState.token,
        },
      });

      const resp = await r.json();
      console.log(resp);
      if (resp.status == "fail" || resp.status == "error") {
        setErr(resp.error.errors.dean.message);
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

  // const handleQuestionChange = (index, event) => {
  //   const newQuestions = [...questionsAnswers];
  //   newQuestions[index].text = event.target.value;
  //   setQuestionsAnswers(newQuestions);
  // };

  const handleRatingChange = (index, event) => {
    const newQuestions = [...questionsAnswers];
    newQuestions[index].rating = event.target.value;
    setQuestionsAnswers(newQuestions);
  };

  let fail = (
    <div
      id="alert-border-2"
      class="flex p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800"
      role="alert"
    >
      <i class="fa-sharp fa-solid fa-circle-exclamation"></i>
      <div class="ml-3 text-lg font-medium">
        Failed to submit survey
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
        Survey has been Submitted successfully
        <a href="#" class="font-semibold underline hover:no-underline"></a>
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
        <h2 className="font-bold  mb-6 text-3xl text-center text-indigo-600">({course.name}) Survey</h2>
          <div className="w-full mx-auto">
          
          {questions.map((question, index) => (
            <div key={index} className="my-8 border-2 p-5">
              <label className="block mb-2 font-semibold">Question{' '}({index + 1}):</label>
              <textarea
                required
                type="text"
                className="w-full p-2 border rounded input-form "
                value={questionsAnswers[index].text}
                readOnly
                // onChange={(e) => handleQuestionChange(index, e)}
              />
              <label className="block mt-2 mb-2 font-semibold">Rating (1 means Low):</label>
              <select
                required
                className="choose-form w-full p-2 border rounded"
                value={questionsAnswers[index].rating}
                onChange={(e) => handleRatingChange(index, e)}
              >
                <option value="1">1</option>
                {Array.from({ length: ratings[index] - 1 }, (_, index) => (
                <option key={index + 2} value={index + 2}>
                  {index + 2}
                </option>
                ))}
                
              </select>
            </div>
          ))}


          <div className="mt-10 border-2 p-5">
            <label className="block mb-2 font-semibold">Overall Rating of the Course </label>
            <select
              required
              className="choose-form w-full p-2 border rounded"
              value={overallRatingSelected}
              onChange={(e) => setOverallRatingselected(e.target.value)}
            >
              <option value="1" selected>1</option>
              {Array.from({ length: overallRating - 1}, (_, index) => (
                <option key={index + 2} value={index + 2}>
                  {index + 2}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-20 w-full">
              {<div className="my-10">{msg}</div>}
          </div>

          <div className="flex justify-end">
              <button
                type="submit"
                class="w-[6rem]  text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm md:text-lg px-5 py-2.5 mx-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
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

export default CreateSurvey;
