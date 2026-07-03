import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { StateType } from "../store/store";

const RootScreen = () => {
  const token = useSelector((state: StateType) => state.token.token);

  return <Navigate to={token === null ? "/main" : "/memo"} replace={true} />;
};

export default RootScreen;
