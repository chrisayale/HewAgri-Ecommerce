import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { checkAuthStatus } from "@/lib/redux/slices/authSlice";
import React, { useEffect } from "react";

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthWrapper;
