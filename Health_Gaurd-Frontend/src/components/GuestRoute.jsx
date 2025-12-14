import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function GuestRoute({ children }) {
  const { user } = useContext(AuthContext);

  // If logged in → redirect away from login/signup
  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
