import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../context/features/userSlice";

const InfoPage = () => {
  // console log user
  const { loading, user } = useSelector(selectUser);
  if (!loading) {
    console.log(user)
  }

  return (
    <div>
      {" "}
      <h1>Infopage</h1>
      <Link to="../homepage">Go back home</Link>
    </div>
  );
};

export default InfoPage;
