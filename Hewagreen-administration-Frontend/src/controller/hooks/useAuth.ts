"use client";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Cookies from "js-cookie";

const useAuth = () => {
  const queryClient = useQueryClient();

  // Fetch user session either from localStorage or cookies
  const fetchSession = () => {
    return (
      JSON.parse(localStorage.getItem("user-session")!) ||
      JSON.parse(Cookies.get("user-session")!)
    );
  };
  const token = localStorage.getItem("authToken");
  const User = JSON.parse(localStorage.getItem("user-session")!);
  // React Query to manage session state
  const idUser = User?.data?.user?.id;
  const nameUser = User?.data?.user?.nom;
  const avatarUser = User?.data?.user?.avatar;
  const {
    data: session,
    isFetching,
    isSuccess,
  } = useQuery(["user-session"], fetchSession, {
    staleTime: Infinity, // Adjust based on how often you expect session to change
    cacheTime: Infinity,
    enabled: !Cookies.get("user-session"), // Only run query if there is no cookie session
  });

  const { mutate: logoutUser } = useMutation(
    () => {
      // Simulate an API call to logout
      return new Promise((resolve) => {
        setTimeout(() => {
          localStorage.removeItem("user-session");
          Cookies.remove("user-session");
        }, 500);
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["user-session"]);
      },
    }
  );

  const destroySession = () => {
    logoutUser();
  };

  const isLogin = !!session;

  return {
    session,
    isLogin,
    destroySession,
    isFetching,
    isSuccess,
    token,
    idUser,
    User,
    nameUser,
    avatarUser,
  };
};

export default useAuth;
