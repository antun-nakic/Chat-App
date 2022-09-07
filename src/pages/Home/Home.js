import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, signInAnonymously, updateProfile } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { login, selectUser } from "../../store/features/userSlice";
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
      <div className="min-h-screen  bg-hero-pattern bg-cover bg-no-repeat bg-center">
        <div className="container  mx-auto px-5 md:px-10 2xl:px-0 ">
          {/* LOGO */}
          <h1 className="text-white  md:text-md 2xl:text-xl font-semibold h-10 pt-12">
            TAMCHAT
          </h1>
          {/* HERO */}
          <div className="h-full md:lg:h-[calc(100vh-5.5rem)] flex flex-col lg:flex-row  items-center justify-between ">
            {/* LEFT SIDE */}
            <div className="mt-20 lg:mt-0 h-full flex flex-col justify-center items-start mb-10">
              <div className="flex flex-col lg:items-start items-center text-white mb-16">
                <h1 className="text-center lg:text-left text-4xl md:leading-[1.4em] 2xl:text-[3.4rem] 2xl:leading-[5rem] l font- mb-6 ">
                  The only chat app you {<br></br>}will ever need...
                </h1>
                <h4 className="max-w-xs xl:max-w-full text-center lg:text-left  font-extralight text-xl 2xl:text-3xl">
                  Make an account and start chatting today!
                </h4>
              </div>
              <div className="flex flex-col lg:mx-0 mx-auto w-[20em] lg:w-[27em] font-medium tracking-wide uppercase gap-5">
                <div className="flex gap-5">
                  <Link
                    className="bg-primary-violet text-white text-center hover:bg-primary-hover py-2 w-full block rounded-xl"
                    to="../login">
                    Login
                  </Link>
                  <Link
                    className="bg-primary-violet text-white text-center hover:bg-primary-hover py-2 w-full block rounded-xl"
                    to="../register">
                    Register
                  </Link>
                </div>
                <button
                  className="bg-secondary-violet font-medium tracking-wide uppercase gap-5 hover:bg-secondary-hover  rounded-xl text-white py-2 w-full"
                  type="submit"
                  onClick={handleGuestLogin}>
                  Login as guest
                </button>
              </div>
            </div>
            <img className="contain" src="./assets/hero.png"></img>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
