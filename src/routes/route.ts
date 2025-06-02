import { createBrowserRouter } from "react-router-dom";
import App from "../layouts/App";
import AboutPage from "../pages/About";
import Home from "../pages/Home";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import DoctorsPage from "@/pages/DoctorsPage";
import ProfilePage from "@/pages/PatientProfile";
import DoctorLayout from "@/layouts/DoctorLayout";
import DoctorAppointmentsPage from "@/pages/doctor/AppointmentsPage";
import DoctorPatientsPage from "@/pages/doctor/PatientsPage";
import DoctorProfilePage from "@/pages/doctor/ProfilePage";
import DoctorSchedulePage from "@/pages/doctor/SchedulePage";
import ReceptionistLayout from "@/layouts/ReceptionistLayout";
import ReceptionistDashboardPage from "@/pages/receptionist/DashboardPage";
import ReceptionistPatientsPage from "@/pages/receptionist/PatientsPage";
import ReceptionistAppointmentsPage from "@/pages/receptionist/AppointmentsPage";
import ReceptionistMedicinesPage from "@/pages/receptionist/MedicinesPage";
import MedicalRecordSchedulePage from "@/pages/MedicalRecordSchedulePage";
import DoctorMedicalRecordHistoryPage from "@/pages/doctor/MedicalRecordHistoryPage";
import ReceptionistProfilePage from "@/pages/receptionist/ProfilePage";
import AdminLayout from "@/layouts/AdminLayout";
import AdminDashboardPage from "@/pages/admin/AdminDashboard";
import PatientManagementPage from "@/pages/admin/PatientManagementPage";
import PatientStatisticsPage from "@/pages/admin/PatientStatisticsPage";
import PrescriptionStatisticsPage from "@/pages/admin/PrescriptionStatisticsPage";

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
      { path: "medical-schedule", Component: MedicalRecordSchedulePage},
      { path: "profile", Component: ProfilePage },
    ],
  },
  {
    path: "/doctor",
    Component: DoctorLayout,
    children: [
      { index: true, Component: DoctorAppointmentsPage },
      { path: "appointments", Component: DoctorAppointmentsPage },
      { path: "patients", Component: DoctorPatientsPage},
      { path: "profile", Component: DoctorProfilePage },
      { path: "schedule", Component: DoctorSchedulePage },
      { path: "medical-records", Component: DoctorMedicalRecordHistoryPage}
    ],
  },
  {
    path: "/receptionist",
    Component: ReceptionistLayout,
    children: [
      { index: true, Component: ReceptionistDashboardPage },
      { path: "patients", Component: ReceptionistPatientsPage },
      { path: "appointments", Component: ReceptionistAppointmentsPage },
      { path: "dashboard", Component: ReceptionistDashboardPage },
      { path: "medicines", Component: ReceptionistMedicinesPage },
      { path: "profile", Component: ReceptionistProfilePage },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboardPage },
      { path: "dashboard", Component: AdminDashboardPage },
      { path: "patient-management", Component: PatientManagementPage },
      { path: "patient-statistics", Component: PatientStatisticsPage },
      { path: "prescription-statistics", Component: PrescriptionStatisticsPage },
    ],
  },
]);
