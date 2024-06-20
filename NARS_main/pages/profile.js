import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import Cookies from "js-cookie";
import Modal from "@/components/Modal";

const Profile = ({ cookies }) => {
    const [showModal, setShowModal] = useState(false); // Declare showModal in component state
    const globalState = useSelector((s) => s.user);

    useEffect(() => {
        document.querySelector("html").style.backgroundColor = "#012a4a";
        document.querySelector("body").style.fontFamily = "Arial, sans-serif";
        document.querySelector("body").style.margin = "0";
        document.querySelector("body").style.padding = "0";
        document.querySelector("body").style.height = "100%";
    }, []);

    if (globalState.loggedInStatus !== "true") {
        return <div className="error">404 could not found</div>;
    }

    const passwordHandler = async (e) => {
        if (e) {
            e.preventDefault();
        }
        try {
            // Password handling logic...
        } catch (e) {
            console.log(e);
        }
    };

    const [errorMessage, setErrorMessage] = useState("");
    const [invalidData, setInvalidData] = useState(false);
    const oldPassword = useRef(null);
    const newPassword = useRef(null);
    const confirmPassword = useRef(null);

    return (
        <div className="h-screen mt-5 flex flex-col items-center text-blue-700 ml-1 rounded-2xl font-bold">
            <h1 className="font-bold text-3xl text-white">Welcome To You In Our Plateform</h1>
            <form className="mt-8" >
                <div className="p-16 ml-10 shadow-2xl rounded-3xl bg-white text-blue-800" style={{width:"730px"}}>
                    <div className="grid md:grid-cols-3 grid-cols-1 gap-2 ">
                        <div className="col-span-3 space-y-4">
                            <div className="flex items-center">
                                <label htmlFor="name" className="block text-lg font-medium w-1/3">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={cookies.name}
                                    className="bg-gray-100 text-gray-600 text-lg rounded-lg text-center focus:ring-blue-500 mb-3 focus:border-blue-500 w-full p-3 ml-2" // Adjusted ml-4 to ml-2
                                    readOnly
                                />
                            </div>
                            <div className="flex items-center">
                                <label htmlFor="role" className="block text-lg font-medium w-1/3">Role:</label>
                                <input
                                    type="text"
                                    id="role"
                                    name="role"
                                    value={cookies.role}
                                    className="bg-gray-100 text-gray-600 text-center text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-3 ml-4"
                                    readOnly
                                />
                            </div>
                            <div className="flex items-center">
                                <label htmlFor="email" className="block text-lg font-medium w-1/3">Email:</label>
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    value={cookies.email}
                                    className="bg-gray-100 text-center text-gray-600 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-3 ml-4"
                                    readOnly
                                />
                            </div>
                            <div className="flex items-center">
                                <label htmlFor="address" className="block text-lg font-medium w-1/3">Address:</label>
                                <input
                                    type="text"
                                    value="Your Static Address Here"
                                    className="bg-gray-100 text-gray-600 text-center text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-3 ml-4"
                                    readOnly
                                />
                            </div>
                            <div className="flex items-center">
                                <label htmlFor="info" className="block text-lg font-medium w-1/3">Info:</label>
                                <input
                                    type="text"
                                    value="Your Static Info Here"
                                    className="bg-gray-100 text-gray-600 text-center text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-3 ml-4"
                                    readOnly
                                />
                            </div>
                            <div className="flex items-center">
                                <label htmlFor="address" className="block text-lg font-medium w-1/3">Contact:</label>
                                <input
                                    type="text"
                                    value="Your Static Address Here"
                                    className="bg-gray-100 text-gray-600 text-center text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-3 ml-4"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 text-center border-b pb-6">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setShowModal(true);
                            }}
                            className="text-white py-2 px-4 uppercase rounded bg-blue-500 hover:bg-blue-900 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5 mr-4"
                        >
                            Change Password
                        </button>
                        <button
                            onClick={(e) => {
                                // Add logic to update profile
                            }}
                            className="text-white py-2 px-4 uppercase rounded bg-green-500 hover:bg-green-900 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5 mr-4"
                        >
                            Update Profile
                        </button>
                        <button
                            onClick={(e) => {
                                // Add logic to save changes
                            }}
                            className="text-white py-2 px-4 uppercase rounded bg-yellow-500 hover:bg-yellow-900 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </form>
            <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
                <div className="py-6 px-6 lg:px-8 text-left   ">
                    <h3 className="mb-4 text-2xl font-bold t text-blue-800 text-center">Change your password</h3>
                    <form className="space-y-6" onSubmit={passwordHandler}>
                        <div className="">
                            <label htmlFor="oldPassword" className="block mb-2 text-lg font-medium text-blue-800">Old password</label>
                            <input
                                type="password"
                                name="oldPassword"
                                id="oldPassword"
                                className="bg-gray-100 border border-gray-300 text-blue-800 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                                required
                                ref={oldPassword}
                            />
                        </div>
                        <div>
                            <label htmlFor="newPassword" className="block mb-2 text-lg font-medium text-blue-800">New password</label>
                            <input
                                type="password"
                                name="newPassword"
                                id="newPassword"
                                className="bg-gray-100 border border-gray-300 text-gray-800 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                                required
                                ref={newPassword}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block mb-2 text-lg font-medium text-blue-800">Confirm new password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                className="bg-gray-100 border border-gray-300 text-gray-800 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                                required
                                ref={confirmPassword}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center"
                        >
                            Update Password
                        </button>
                        {invalidData && <div className="text-red-500 flex justify-center">{errorMessage}</div>}
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default Profile;
