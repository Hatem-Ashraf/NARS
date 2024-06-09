import React from 'react';
import Link from "next/link";
import { userActions } from "./store/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import HeaderElementProgramCoordinator from "./HeaderElementProgramCoordinator.js";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { header } from "./header";
import { useEffect, useState, useRef } from "react";
import { CgProfile, CgLogOut } from "react-icons/cg";
import { GiTeacher } from "react-icons/gi";
import { GrAddCircle, GrOrderedList } from "react-icons/gr";
import { BsBook } from "react-icons/bs";
import { RiFileList2Line } from "react-icons/ri";
import generatePdf from 'pages/ProgramCoo/downloadSpecs.js';
import ProgramCoordinatorDashboard from 'components/ProgramCoordinatorDashboard.js';

const DashboardPage = () => {
  return (
    <div>
      <ProgramCoordinatorDashboard />
    </div>
  );
};

export default DashboardPage;
