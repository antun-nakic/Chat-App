import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { auth, onAuthStateChanged } from "./firebase";
import { login, logout, selectUser } from "./store/features/userSlice";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import InfoPage from "./components/InfoPage";
import Homepage from "./components/Homepage";
import Home from "./pages/Home/Home";
import Chat from "./pages/chat/Chat";
import Login from "./components/Login";
import Register from "./components/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Rooms from "./components/Rooms";
import DynamicPage from "./routes/DynamicPage";

function App() {
  const dispatch = useDispatch();

  // console log user
  const { loading, user } = useSelector(selectUser);
  if (!loading) {
    console.log(user);
  }

  // check if user is logged in
  useEffect(() => {
    onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        dispatch(
          login({
            email: userAuth.email,
            uid: userAuth.uid,
            displayName: userAuth.displayName,
            photoUrl: userAuth.photoURL,
          })
        );
      } else {
        dispatch(logout());
      }
    });
  }, [dispatch]);

  return (
    <div className="bg-hero-pattern bg-cover min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/" element={<ProtectedRoutes />}>
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/info" element={<InfoPage />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<DynamicPage />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <ToastContainer
        position="top-center"
        theme="dark"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
