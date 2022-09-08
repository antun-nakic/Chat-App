import { useSelector } from "react-redux";
import { selectUser } from "../store/features/userSlice";
import Avatar from "react-avatar";
import { RiSettings5Fill } from "react-icons/ri";

const Homepage = () => {
  // console log user
  const { loading, user } = useSelector(selectUser);
  if (!loading) {
    console.log(user);
  }

  return (
    <div className="flex min-h-screen ">
      <section className=" w-1/2">
        {/* profile info */}
        <div className="text-white bg-gradient-to-r from-[#1c2232] to-[#18182a] flex justify-center border-opacity-40 items-center p-6 gap-7 border-b border-r  border-white">
          <div className="relative ">
            <Avatar
              size={40}
              round="50%"
              maxInitials={2}
              name={"admin"}
              textSizeRatio={1.5}
            />
            <div className="bg-green-500 w-3 h-3 rounded-full absolute top-0 -right-0.5"></div>
          </div>
          <div>
            <p className="font-semibold">Admin123</p>
            <p className="font-light">#30953</p>
          </div>
          <RiSettings5Fill className="ml-auto text-3xl " />
        </div>
        <div className="flex ">
          {/* chat room*/}
          <div className="w-1/3 bg-gradient-to-b from-[#1c2232] to-[#18182a] ">
            chat rooms
          </div>
          {/* user list */}
          <div className="min-h-[calc(100vh-6.1rem)] bg-gradient-to-b from-[#121021] to-[#1c1a31] border-x border-white border-opacity-40  w-full">
            user list
          </div>
        </div>
      </section>
      <section className="bg-hero-pattern bg-cover w-full min-h-screen ">
        Chat
      </section>
    </div>
  );
};

export default Homepage;
