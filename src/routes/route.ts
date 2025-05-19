import { createBrowserRouter } from "react-router-dom";
import App from "../layouts/App";
import AboutPage from "../pages/About";
import Home from "../pages/Home";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import DoctorsPage from "@/pages/DoctorsPage";
import PrescriptionsPage from "@/pages/Prescription";
import ExaminationSchedulePage from "@/pages/ExaminationSchedule";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: AboutPage },
      { path: "login", Component: LoginPage },
      { path: "register", Component: RegisterPage },
      { path: "find-doctor", Component: DoctorsPage },
      { path: "prescriptions", Component: PrescriptionsPage},
      { path: "examination-schedule", Component: ExaminationSchedulePage}
    ],
  },
]);
