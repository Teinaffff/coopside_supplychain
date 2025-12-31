import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { User, Users, LogOut } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store";
import { logoutUser } from "../../store/auth/auth-extra";
import { Avatar } from "../../common/ui/avatar";
import { AlertModal } from "../../common/modals/alert-modal";

const DropdownUser = () => {
  const dispatch = useAppDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  
  // Get current user from Redux store
  const { currentUser } = useAppSelector((state) => state.auth);
  const username = currentUser?.username || "User";
  const userType = currentUser?.userType || "Admin";

  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className="relative">
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-semibold text-gray-900 dark:text-white">
            {username}
          </span>
          <span className="block text-xs text-gray-500 dark:text-gray-400">{userType}</span>
        </span>

        <Avatar name={username} size="md" />
      </Link>

      {/* <!-- Dropdown Start --> */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 mt-4 flex w-64 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-slate-500 ${
          dropdownOpen === true ? "block" : "hidden"
        }`}
      >
        <ul className="flex flex-col gap-5 pb-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
          <li>
            <Link
              to="/coop/profile"
              className="flex items-center gap-3.5 text-sm text-gray-700 hover:text-cyan-500 dark:text-gray-300 dark:hover:text-cyan-400 lg:text-base"
              onClick={() => setDropdownOpen(false)}
            >
              <User />
              My Profile
            </Link>
          </li>
          <li>
            <Link
              to="/coop/system/user-roles"
              className="flex items-center gap-3.5 text-sm text-gray-700 hover:text-cyan-500 dark:text-gray-300 dark:hover:text-cyan-400 lg:text-base"
              onClick={() => setDropdownOpen(false)}
            >
              <Users />
              User and Roles
            </Link>
          </li>
        </ul>
        
        <button
          className="flex items-center gap-3.5 px-6 py-4 text-sm text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 lg:text-base"
          onClick={() => {
            setDropdownOpen(false);
            setShowLogoutModal(true);
          }}
        >
          <LogOut />
          Logout
        </button>
      </div>
      {/* <!-- Dropdown End --> */}

      {/* Logout Confirmation Modal */}
      <AlertModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={async () => {
          setIsLoggingOut(true);
          await dispatch(logoutUser() as any);
          setIsLoggingOut(false);
          setShowLogoutModal(false);
          navigate("/login");
        }}
        loading={isLoggingOut}
        title="Confirm Logout"
        description="Are you sure you want to logout? You will need to sign in again to access your account."
      />
    </div>
  );
};

export default DropdownUser;
