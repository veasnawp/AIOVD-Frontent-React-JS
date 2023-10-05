import { useLocation, Navigate, Outlet, } from "react-router-dom";
import { UserPayload } from "../../configs/interfaces/google";

type RequireAuthProps = {
  user: UserPayload;
  token: any;
}

const RequireAuth = (props: RequireAuthProps) => {
  const { user, token } = props
  const location = useLocation();

  return (
    user && token
      ? <Outlet />
      : <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default RequireAuth;