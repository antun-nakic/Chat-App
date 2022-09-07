import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/Header";
import { useSelector } from "react-redux";
import { selectUser } from "../store/features/userSlice";
import Sidebar from "../components/Sidebar";

const ZasticeneRute = () => {
  const { loading, user } = useSelector(selectUser);

  return (
    !loading &&
    (user === null ? (
      <Navigate to="/login" replace />
    ) : (
      <>
        <Sidebar />
        <Header />
        <Outlet />
      </>
    ))
  );
};

export default ZasticeneRute;
