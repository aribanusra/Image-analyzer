import { ToastContainer } from "react-toastify"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from "./pages/auth"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import Analyze from "./pages/Analyze"

function App() {
  return (
    <>
      <main className="text-red-500 ">
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/analyze/:id" element={<Analyze />} />
            <Route path="/" element={<Home />} />
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
  )
}

export default App
