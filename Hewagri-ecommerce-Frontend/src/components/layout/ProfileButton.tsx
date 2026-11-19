import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { logout } from "@/lib/redux/slices/authSlice";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import React from "react";
import { CustomImage } from "../shared";
import { baseUrl } from "@/constants";
import { useToast } from "@/context";

const ProfileButton = () => {
  const notify = useToast();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector(
    (state) =>
      state.auth.user as unknown as {
        avatar: string;
        nom: string;
        postnom: string;
        email: string;
        phone: string;
      }
  );

  const handleSignOut = () => {
    dispatch(logout());
    notify("Vous êtes déconnecté", "success");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Menu as="div" className="relative">
      <div>
        <MenuButton className="relative flex items-center justify-center text-sm space-x-3">
          <span className="sr-only">Open user menu</span>
          <span className="notranslate text-yellow-200 hover:text-white font-semibold notranslate">
            {user?.nom.trim()} {user?.postnom.trim()}
          </span>
          <div className="w-[30px] h-[30px] border p-1 rounded-full overflow-hidden">
            <CustomImage
              src={`${baseUrl}/${user.avatar}`}
              alt={`${user.nom} profile`}
              className="w-full h-full object-center object-fit"
              width={1000}
              height={1000}
            />
          </div>
        </MenuButton>
      </div>
      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md py-2 bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <MenuItem>
          <div className="pb-3 px-3 border-b flex flex-col items-center justify-between space-y-2">
            <p className="block notranslate font-semibold text-sm text-gray-700 w-full text-center">
              {user?.nom.trim()} {user?.postnom.trim()}
            </p>
            {user.phone && (
              <p className="block notranslate text-sm text-primary-green font-semibold w-full text-center">
                {user?.phone}
              </p>
            )}
          </div>
        </MenuItem>

        <MenuItem>
          <Link
            href={"/orders"}
            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
          >
            Vos Commandes
          </Link>
        </MenuItem>
        <MenuItem>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full px-4 py-2 text-sm text-red-500 font-semibold data-[focus]:bg-gray-100 flex flex-row items-center justify-between space-x-2"
          >
            <span>Se déconnecter</span>
            <ArrowLeftStartOnRectangleIcon className="w-5 h-5 rotate-180" />
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
};

export default ProfileButton;
