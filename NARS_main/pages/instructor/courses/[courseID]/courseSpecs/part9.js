import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import CustomReactToPdf from "@/pages/pdf2/pdf333";
import { updateField } from "@/components/store/userSlice";

const part2 = ({ cookies }) => {
  const d = useDispatch();

  const userState = useSelector((s) => s.user);
  const courseSpecs = cookies.courseSpecs;
  useEffect(() => {
    const getData = async function () {
      const r = await fetch(
        `http://localhost:8087/created-courses/${courseID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      const data = await r.json();
      d(updateField({ field: "courseSpecs", value: data.data.courseSpecs }));

      console.log(data);
      const references = data.data.courseSpecs.references;
      if (references.courseNotes) {
        notes.current.value = references.courseNotes;
      }
      if (references.courseWebsites) {
        websites.current.value = references.courseWebsites;
      }
      console.log(references);
      if (references.books[0]) {
        books.current.value = references.books[0];
      }
      if (references.recommendedBooks) {
        Rbooks.current.value = references.recommendedBooks;
      }
    };
    getData();
  }, []);
  if (userState.role != "instructor" || userState.loggedInStatus != "true") {
    return <div className="error">404 could not found</div>;
  }
  const token = userState.token;
  const [isRunning, setIsRunning] = useState(true);

  const refToImgBlob = useRef();
  const buttonRef = useRef(null);
  function ChildComponent({ toPdf }) {
    const handleClick = async () => {
      try {
        console.log(toPdf);
        const pdfBlob = await toPdf();
        const reader = new FileReader();
        reader.readAsDataURL(pdfBlob);

        reader.onload = () => {
          const pdfBase64 = reader.result.split(",")[1];
          localStorage.setItem("pdf9", pdfBase64);
        };
        // do something with pdfBlob
      } catch (error) {
        console.error("Failed to capture PDF:", error);
      }
    };

    return (
      <>
        {" "}
        <button ref={buttonRef} onClick={handleClick} hidden>
          Capture as PDF
        </button>
      </>
    );
  }
  /* if (cookies.role != 'instructor' || cookies.loggedInStatus != 'true') {
 
         return <div className='error'>404 could not found</div>
     }*/
  useEffect(() => {
    document.querySelector("body").classList.add("scrollbar-none");
  });
  const router = useRouter();
  const { courseID } = router.query;
  const notes = useRef();
  const books = useRef();
  const Rbooks = useRef();
  const websites = useRef();

  const submitHandler = async (e) => {
    buttonRef.current.click();

    e.preventDefault();
    const r = await fetch(
      `http://localhost:8087/created-courses/${courseID}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          courseSpecs: {
            references: {
              courseNotes: notes.current.value,
              books: books.current.value,
              recommendedBooks: Rbooks.current.value,
              courseWebsites: websites.current.value,
            },
          },
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    const resp = await r.json();
    console.log(resp);

    // window.location.href = `/instructor/courses/${courseID}/courseSpecs/part10`;
    router.push(`/instructor/courses/${courseID}/courseSpecs/part10`);
  };

  return (
    <>
      <div className="flex flex-row w-screen h-screen mt-2">
        <CustomReactToPdf targetRef={refToImgBlob} filename="part9.pdf">
          {({ toPdf }) => <ChildComponent toPdf={toPdf} />}
        </CustomReactToPdf>
        <form
          onSubmit={submitHandler}
          className="bg-sky-50 h-screen w-[80%] translate-x-[25%] flex flex-col justify-center items-center text-black ml-1 scrollbar-none relative"
        >
          <div
            className="contentAddUser2 flex flex-col gap-10"
            ref={refToImgBlob}
          >
            <div className="flex gap-20 ">
              <div className="flex flex-col gap-5 w-full">
                <div>-Course Notes:</div>
                <textarea
                  rows="6"
                  name="notes"
                  className="w-full input-form"
                  ref={notes}
                  placeholder="Type here the Course Notes"
                ></textarea>
              </div>
              <div className="flex flex-col gap-5  w-full">
                <div> -Books:</div>
                <textarea
                  rows="6"
                  name="books"
                  className="w-full input-form"
                  ref={books}
                  placeholder="Type here the books"
                ></textarea>
              </div>
            </div>

            <div className="flex gap-20 ">
              <div className="flex flex-col gap-5 w-full">
                <div>-Recommended Books:</div>
                <textarea
                  rows="6"
                  name="Rbooks"
                  className="w-full input-form pl-1"
                  ref={Rbooks}
                  placeholder="Type here the Recommended Books"
                ></textarea>
              </div>
              <div className="flex flex-col gap-5  w-full">
                <div> -Course websites: </div>
                <textarea
                  rows="6"
                  name="websites"
                  className="w-full input-form pl-1"
                  ref={websites}
                  placeholder="Type here the Course websites"
                ></textarea>
              </div>
            </div>
          </div>
          <div className="flex justify-end absolute bottom-[8rem] right-[7rem]">
            <button
              type="submit"
              class="w-[6rem]  text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm md:text-lg px-5 py-2.5 mx-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export default part2;
