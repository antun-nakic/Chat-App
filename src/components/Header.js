import { auth } from "../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../context/features/userSlice";

function Header() {
  const { user } = useSelector(selectUser);

  const logoutOfApp = () => {
    auth.signOut();
  };

  return (
    <div className="w-full h-20 bg-black text-white flex items-center">
      <h2 className="text-white text-3xl ml-auto pl-10">
        user: {user.displayName}
      </h2>
      <button
        className="ml-auto mr-20 bg-violet-800 hover:bg-violet-600 px-10 py-2 rounded-xl"
        onClick={logoutOfApp}
      >
        Logout
      </button>
    </div>
  );
}

export default Header;
