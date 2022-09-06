import { useSelector } from "react-redux";
import { selectUser } from "../context/features/userSlice";

const Homepage = () => {
  // console log user
  const { loading, user } = useSelector(selectUser);
  if (!loading) {
    console.log(user);
  }

  return <div className="ml-80 mt-40">homepage</div>;
};

export default Homepage;
