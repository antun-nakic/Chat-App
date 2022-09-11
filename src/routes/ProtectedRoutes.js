import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../store/features/userSlice";

const ZasticeneRute = () => {
  const { loading, user } = useSelector(selectUser);

  return (
    !loading && (user === null ? <Navigate to="/login" replace /> : <Outlet />)
  );
};

export default ZasticeneRute;
