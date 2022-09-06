import { selectUser } from "../context/features/userSlice";
import { useSelector } from "react-redux";
import Avatar from "react-avatar";

const Sidebar = () => {
  const { user } = useSelector(selectUser);

  return (
    <div className="h-full fixed bg-black text-white w-80 ">
      <div className="bg-zinc-300 h-20 text-black">
        <Avatar
          src={user.photoUrl}
          size={40}
          round="50%"
          name={user.displayName}
        />
        <h1 className="text-black">{user.displayName}</h1>
      </div>
      <div className="flex flex-1 justify-between items-center">
        <div className="bg-slate-400 h-screen w-40">Chat rooms</div>
        <div className="bg-slate-800 h-screen w-full">Online ppl</div>
      </div>
    </div>
  );
};

export default Sidebar;
