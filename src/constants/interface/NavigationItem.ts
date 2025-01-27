import { ReactElement } from "react";

export interface NavigationItem {
  label: string; // The label for the navigation item
  to: string; // The URL path for navigation
  pathname: string; // The current route pathname
  icon: ReactElement; // The React element for the icon
  subMenu?: NavigationItem[];
}
