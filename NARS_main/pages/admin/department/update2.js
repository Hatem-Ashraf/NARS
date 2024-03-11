import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { handleFile } from "../../../common/uploadFile";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const AddStudent = () => {
  const userState = useSelector((state) => state.user);
  const [departments, setDepartments] = useState([]);
  const [facultyArr, setFaculty] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [importData, setImportData] = useState([]);
  const [exportModalIsOpen, setExportModalIsOpen] = useState(false);

  useEffect(() => {
    // Fetch faculties and setFaculty state
    const fetchFaculties = async () => {
      try {
        const response = await fetch("http://localhost:8083/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userState.token}`,
          },
        });
        const data = await response.json();
        if (data && data.data) {
          setFaculty(data.data.map((faculty) => ({ id: faculty._id, name: faculty.name })));
        }
      } catch (error) {
        console.error("Error fetching faculties:", error);
      }
    };
    fetchFaculties();
  }, [userState.token]);

  const handleFacultyChange = async (e) => {
    const selectedFacultyId = e.target.value;
    setSelectedFaculty(selectedFacultyId);

    try {
      const response = await fetch(`http://localhost:8083/${selectedFacultyId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userState.token}`,
        },
      });
      const data = await response.json();
      if (data && data.data && data.data.departments) {
        const tempDepartments = data.data.departments.map((department) => ({
          id: department._id,
          name: department.name,
        }));
        setDepartments(tempDepartments);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleImport = (e) => {
    handleFile(e, (data) => {
      setImportData(data);
      setExportModalIsOpen(true);
      document.body.classList.toggle("overflow-hidden");
    });
  };

  const downloadTemplateHandler = () => {
    const header = ["name", "code", "email", "faculty", "academicYear", "department"];
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([header]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "studentsTemplate.xlsx");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Your submission logic here
  };

  return (
    <div className=" flex flex-row h-screen">
      <form onSubmit={handleSubmit} className="h-screen w-screen flex flex-col justify-center items-center text-black">
        <div className="contentAddUser2 flex flex-col gap-10 overflow-auto">
        <h2 className="text-2xl font-semibold mb-4">Update Department</h2>
        <div className="grid grid-cols-1 gap-4">
        <div className="flex justify-between">
            <div className="w-2/5">
              <label htmlFor="faculty">Faculty</label>
              <select
              id="faculty"
                  className="input-field appearance-none border border-gray-300 rounded-md py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-blue-500 focus:bg-white focus:ring focus:ring-blue-200"
                  onChange={(e) => {
                    // Handle selected option logic
                  }}
                >
                  <option value="" disabled selected>Select Faculty</option>
                  <option value="Computer Engineering">Shoubra Faculty of Engineering</option>
              </select>

            </div>
            <div className="w-2/5">
              <label htmlFor="department">Department</label>
              <select
              id="department"
                  className="input-field appearance-none border border-gray-300 rounded-md py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-blue-500 focus:bg-white focus:ring focus:ring-blue-200"
                  onChange={(e) => {
                    // Handle selected option logic
                  }}
                >
                  <option value="" disabled selected>Select Department</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="w-2/5">
              <div>Name</div>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="w-2/5">
              <div>Department Code </div>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
          <div className="flex justify-between">
            <div className="w-2/5">
              <div>Head of Department (Email)</div>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="w-2/5">
              <div>Vission</div>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
          <div className="flex justify-between">
            <div className="w-2/5">
              <div>Mission</div>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
          {/* <div>
            <label htmlFor="code">D Code</label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="input-field"
            />
          </div> */}
          <div>
          <label htmlFor="desciption">Description</label>
          <textarea class="w-full input-form bg-white"
          id="desciption"
           rows="4" placeholder="Departmen descriptiont"></textarea>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <div>{msg}</div>
          <div className="space-x-4">
            <button
              type="button"
              onClick={downloadTemplateHandler}
              className="btn bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg"
            >
              Download Template
            </button>
            <input type="file" id="selectFile" className="hidden" onChange={handleImport} />
            <label
              htmlFor="selectFile"
              className="btn bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer"
            >
              Import
            </label>
            <button
              type="submit"
              className="btn bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg"
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

export default AddStudent;
