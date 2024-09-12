import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";

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

const GuestGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, token } = useSelector((state) => state.user);
  const { menu } = useSelector((state) => state.menu);

  useEffect(() => {
    if (isLoggedIn && verifyToken(token)) {
      console.log(location?.state?.from?.pathname);
      console.log(menu);
      const redirectPath =
        location?.state?.from?.pathname || `/home/${menu[0]?.menu_url}`;
      navigate(redirectPath, { replace: true });
    }
  }, [isLoggedIn, token, navigate, location?.state?.from?.pathname, menu]);

  return children;
};

export default GuestGuard;
