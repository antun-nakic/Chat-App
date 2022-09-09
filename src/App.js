import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { auth, onAuthStateChanged } from "./firebase";
import { login, logout, selectUser } from "./store/features/userSlice";
import ProtectedRoutes from "./routes/ProtectedRoutes";

import Chat from "./pages/chat/Chat";
import Home from "./pages/Home/Home";

import Login from "./components/Login";
import Register from "./components/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Rooms from "./components/Rooms";
import DynamicPage from "./routes/DynamicPage";

import { AnimatePresence } from "framer-motion";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
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
      <AnimatePresence exitBeforeEnter>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/" element={<ProtectedRoutes />}>
            <Route path="/chat" element={<Chat />} />

            <Route path="/chat/:id" element={<DynamicPage />} />
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
      </AnimatePresence>
    </div>
  );
}

export default App;
