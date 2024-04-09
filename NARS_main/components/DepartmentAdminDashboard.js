import Link from "next/link";
import { useRouter } from "next/router";
import { header } from "./header";
import { CgProfile } from "react-icons/cg";
import { CgLogOut } from "react-icons/cg";
import { GrOrganization } from "react-icons/gr";
import { FaUniversity } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function DepartmentAdminDashboard(cookies) {
    const userState = useSelector((s) => s.user);
    const router = useRouter();
    const navStatus = useSelector((s) => s.user.navStatus);
    const [name, setName] = useState("")
    useEffect(() => {
        async function getName() {
            try {
                const r = await fetch(`http://localhost:8084/${userState.department}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: "Bearer " + userState.token,
                    },
                });

                const resp = await r.json();
                setName(resp.data.name);
                console.log(userState.token);
            } catch (e) {
                console.log(e);
            }
        };
        getName();
    }, []);
    const logoutHandler = () => {
        router.push('/logout')
    };
    return (
        <nav
            className="nav2"
        >
            <Link className="link2 focus:text-green-400 " href="/profile">
                <div className="text-center text-4xl text-indigo-900">
                NARQA
                </div>
            </Link>
            <Link className="link2 focus:text-green-400 " href="/profile">
                <span>
                <CgProfile
                    style={{ fontSize: 30, display: "inline", marginBottom: 5 }}
                />
                </span>
                <span className="ml-2">Profile</span>
            </Link>
            <Link
                className="link2 focus:text-green-400"
                href="/department/viewprograms"
            >
                 <span >
                     <span>
                        <i class="fa-solid fa-layer-group text-3xl"></i>
                    </span>
                    
                    <span className="ml-2">View Programs</span>
                </span>
                
            </Link>
            <Link
                className="link2 focus:text-green-400"
                href="/department/viewprograms"
            >
                 <span >
                     <span>
                         <i class="fa-solid fa-file-lines text-3xl ml-1"></i>
                    </span>
                    
                    <span className="ml-3">Department Report</span>
                </span>
                
            </Link>


            <button
                className="link2 focus:text-green-400 text-left"
                onClick={logoutHandler}
            >
                <span>
                    <CgLogOut
                        style={{ fontSize: 30, display: "inline", marginBottom: 0 }}
                    />
                </span>
                <span className="ml-2">Logout</span>
            </button>
        </nav>
    );
}
