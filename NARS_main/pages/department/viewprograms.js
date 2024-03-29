import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ProgramList from "@/components/ProgramList";
import { useSelector } from "react-redux";

const viewprograms = ({ cookies }) => {
    const userState = useSelector((s) => s.user);
    if (userState.role != "department admin" || userState.loggedInStatus != "true") {
        return <div className="error">404 could not found</div>;
    }

    useEffect(() => {
        document.querySelector("body").classList.add("scrollbar-none");
    });
    console.log(cookies.token);
    const [programs, setPrograms] = useState([]);
    useEffect(() => {
        submitHandler();
    }, []);
    const submitHandler = async (e) => {
        if (e) {
            e.preventDefault();
        }
        try {
            const resp = await fetch(`http://localhost:8086/?department=${userState.department}`, {
                headers: {
                    Authorization: "Bearer " + userState.token,
                },
            });
            const data = await resp.json();
            console.log(data.data);
            let arr = data.data;

            arr = arr.map((e) => {
                return {
                    name: e.name,
                    id: e._id,
                    competences: e.competences,
                };
            });
            setPrograms(arr);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <>
            <div className="flex flex-row  h-screen mt-2 text-xl">
                <form
                    onSubmit={submitHandler}
                    className="h-screen w-screen  flex flex-col justify-center items-center text-black ml-1 rounded-2xl"
                >
                    <div className="contentAddUser2 overflow-auto flex flex-col gap-10">
                        <div className="flex items-center justify-between">
                            <p className="font-normal text-xl">Department {">"} View Programs</p>
                        </div>

                        <ProgramList programs={programs} />
                    </div>
                </form>
            </div>
        </>
    );
};

export default viewprograms;
