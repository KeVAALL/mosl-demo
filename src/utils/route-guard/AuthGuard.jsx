import React, { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearProfile } from "../../redux/slices/userSlice";
import { clearSelectedProject } from "../../redux/slices/projectSlice";

const verifyToken = (authToken) => {
  if (!authToken) {
    return false;
  }
  const decoded = jwtDecode(authToken);

  /**
   * Property 'exp' does not exist on type '<T = unknown>(token: string, options?: JwtDecodeOptions | undefined) => T'.
   */
  return decoded.exp > Date.now() / 1000;
};
// eslint-disable-next-line react/prop-types
function AuthGuard({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);

  console.log(verifyToken(token));
  useEffect(() => {
    if (!verifyToken(token)) {
      dispatch(clearProfile());
      dispatch(clearSelectedProject());

      navigate("/", { replace: true });
    }
  }, [token, dispatch, navigate]);

  if (!verifyToken(token)) {
    console.log(verifyToken(token));
    return null; // Prevent rendering if token is not valid
  }

  return children;
}

export default AuthGuard;
