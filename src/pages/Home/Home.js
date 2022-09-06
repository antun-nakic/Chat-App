import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, signInAnonymously, updateProfile } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { login, selectUser } from "../../context/features/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const [userRegistered, setUserRegistered] = useState(false);
  const { user } = useSelector(selectUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (user !== null) {
      navigate(`/chat`);
    }
  }, [user, userRegistered, navigate]);

  const dispatch = useDispatch();
  const handleGuestLogin = (e) => {
    const idToast = toast.loading("Logging in as guest...");
    e.preventDefault();
    // Sign in annonymously
    signInAnonymously(auth)
      .then((userAuth) => {
        setUserRegistered(true);
        toast.update(idToast, {
          render:
            "You are now logged in. Create an account if you enjoy the app.",
          type: "success",
          isLoading: false,
          autoClose: 5000,
          closeOnClick: true,
          draggable: true,
        });
        updateProfile(userAuth.user, {
          displayName: "Guest" + Math.floor(Math.random() * 1000),
          photoUrl: "https://i.imgur.com/6uGxYQq.png",
        });
        // Dispatch the user information for persistence in the redux state
        dispatch(
          login({
            uid: userAuth.user.uid,
            displayName: "Guest" + Math.floor(Math.random() * 1000),
            // photoUrl: guest photo
            photoUrl: "https://i.imgur.com/6VBx3io.png",
          })
        );
      })
      .catch((err) => {
        toast.dismiss(idToast);
        alert(err);
      });
  };
  return (
    <>
      <div className="min-h-screen bg-hero-pattern bg-cover bg-no-repeat flex items-center justify-center flex-col ">
        <div>
          <h1 className="text-4xl mb-20 text-white">
            Chat application Algebra
          </h1>
          <div className="flex flex-col gap-5">
            <Link
              className="bg-violet-800 text-white text-center hover:bg-violet-700 py-2 w-full block rounded-xl"
              to="../login">
              Login
            </Link>
            <Link
              className="bg-violet-800 text-white text-center hover:bg-violet-700 py-2 w-full block rounded-xl"
              to="../register">
              Register
            </Link>
            <button
              className="bg-violet-800 hover:bg-violet-700 rounded-xl text-white py-2 w-full"
              type="submit"
              onClick={handleGuestLogin}>
              Login as guest
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
