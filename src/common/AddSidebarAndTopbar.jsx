import React from "react";
// Removed admin dependency; provide simple placeholders or migrate to coop layout as needed
const Sidebar = () => null;
const Topbar = () => null;

function AddSidebarAndTopbar({ children }) {
  return (
    <div className="app">
      <Sidebar isSidebar={true} />
      <main className="content">
        <Topbar setIsSidebar={true} />
        {children}
      </main>
    </div>
  );
}

export default AddSidebarAndTopbar;
