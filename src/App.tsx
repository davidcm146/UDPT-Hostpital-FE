import { RouterProvider } from "react-router-dom";
import { router } from "./routes/route";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
