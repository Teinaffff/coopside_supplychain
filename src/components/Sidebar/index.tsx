import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Logo from "../../common/Logo";
import { NavigationItem } from "../../constants/interface/NavigationItem";
import { isActivePath } from "../../lib/utils";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  menuItems: NavigationItem[];
  rootPath: string;
}

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  menuItems,
  rootPath,
}: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // State to track which submenu is open
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  // Toggle submenu visibility
  const toggleSubMenu = (label: string) => {
    setOpenSubMenu(openSubMenu === label ? null : label);
  };

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-[50] flex h-screen w-72 flex-col overflow-y-hidden bg-cyan-500 dark:bg-slate-800 duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="relative flex items-center justify-between gap-2 px-6 pt-5 ">
        <Logo />

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden text-white dark:text-slate-200 hover:text-slate-200 dark:hover:text-white"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
           

            <ul className="mb-6 flex flex-col gap-0.5">
              {menuItems.map((item) => (
                <li key={item.to}>
                  <SidebarItem
                    label={item.label}
                    to={item.to}
                    icon={item.icon}
                    isActive={
                      item.subMenu
                        ? pathname.startsWith(item.pathname)
                        : isActivePath(pathname, rootPath, item.pathname)
                    }
                    subMenu={item.subMenu}
                    isOpen={openSubMenu === item.label}
                    toggleSubMenu={() => toggleSubMenu(item.label)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

const SidebarItem = ({
  to,
  icon,
  label,
  isActive,
  subMenu,
  isOpen,
  toggleSubMenu,
}: {
  to: string;
  icon: JSX.Element;
  label: string;
  isActive: boolean;
  subMenu?: NavigationItem[];
  isOpen: boolean;
  toggleSubMenu: () => void;
}) => (
  <div>
    <NavLink
      to={to}
      className={`group relative flex items-center gap-3 py-3 px-4 font-medium duration-300 ease-in-out ${
        isActive
          ? "bg-cyan-300 text-white border-l-4 border-white"
          : "text-cyan-200 hover:text-cyan-100 hover:bg-cyan-600/20"
      }`}
      onClick={subMenu ? toggleSubMenu : undefined}
    >
      <div className="text-white">
        {icon}
      </div>
      <span className="flex-1">{label}</span>
      {subMenu && (
        <span className="text-white">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      )}
    </NavLink>
    {subMenu && isOpen && (
      <ul className="ml-6 mt-1 flex flex-col gap-1">
        {subMenu.map((subItem) => (
          <li key={subItem.to}>
            <NavLink
              to={subItem.to}
              className={`flex items-center gap-3 py-2 px-4 font-medium duration-300 ease-in-out text-cyan-200 hover:text-cyan-100 hover:bg-cyan-600/20 ${
                isActive ? "bg-cyan-300 text-white border-l-4 border-white" : ""
              }`}
            >
              <div className="text-white">
                {subItem.icon}
              </div>
              <span className="flex-1">{subItem.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    )}
  </div>
);
