import { createBrowserRouter } from "react-router-dom";
import Root from "../layouts/Root";


import About from "../pages/About";
import Home from "../pages/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
    ],
  },
]);
