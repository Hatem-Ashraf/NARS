import React from "react";
import Link from "next/link";
import InsertDriveFileRounded from "@mui/icons-material/InsertDriveFileRounded";


const AssignFileItem = ({ name, id, dueTo, possibleMarks }) => {
  const d = new Date();
  let date = d.toJSON();
  if (dueTo > date) console.log("valid");
  return (
    <div className="fileItem ">
      <Link
        href={`http://localhost:8087/assignment/${id}`}
        target="_blank"
        download
      >
        <div className="fileItem--left" title="Click here to dowload the file">
          <InsertDriveFileRounded />
          <p>{name}</p>
        </div>
        <div className="fileItem--right absolute right-80">
          <p>{possibleMarks}</p>
        </div>
        <div className="fileItem--right ">
          <p>{dueTo}</p>
        </div>
      </Link>
    </div>
  );
};

export default AssignFileItem;
