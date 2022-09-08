import { Navigate, Outlet } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectUser } from "../store/features/userSlice";

import Homepage from "../pages/chat/Chat";

const ZasticeneRute = () => {
  const { loading, user } = useSelector(selectUser);

  return (
    !loading &&
    (user === null ? (
      <Navigate to="/login" replace />
    ) : (
      <>
        {/* <Homepage /> */}
        <Outlet />
      </>
    ))
  );
};

export default ZasticeneRute;
