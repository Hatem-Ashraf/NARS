import Link from "next/link";
import { useRouter } from "next/router";
const erasecourse = () => {
  const router = useRouter();

  const submitHandler = async (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="flex flex-row w-screen h-screen mt-2">
        <form
          onSubmit={submitHandler}
          className="bg-sky-50 h-screen w-[80%]  translate-x-[25%]  flex flex-col justify-center items-center text-black ml-1 rounded-2xl"
          >
          <div className="contentAddUser2 flex flex-col gap-10">
            <p className="font-normal mb-10">Courses {">"} Erase Course </p>
            <div className="flex gap-20 ">
              <div className="flex flex-col gap-5  w-2/5">
                <div>Course Name</div>
                <input type="text" className="inputAddUser2  w-full" />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                class="w-[6rem]  text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm md:text-lg px-5 py-2.5 mx-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Erase
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
export default erasecourse;
