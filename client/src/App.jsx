import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/auth";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Analyze from "./pages/Analyze";
import PrivateRoute from "./components/Protectedroute";

function App() {
  return (
    <>
      <main className="text-red-500 ">
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route path="/profile" element={ <PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/analyze/:id" element={ <PrivateRoute><Analyze /></PrivateRoute>} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
      </main>
    </>
  );
}

export default App;
