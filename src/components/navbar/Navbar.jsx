import React, { useState } from "react";
import { Menubar } from "primereact/menubar";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { useMediaQuery } from "react-responsive";
import { logout } from "../../api/AuthApi";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const loggedIn = Boolean(user);
  const navigate = useNavigate();

  const [visibleSidebar, setVisibleSidebar] = useState(false);
  const isSmallScreen = useMediaQuery({ maxWidth: 1024 }); // Updated breakpoint to 1024px

  const items = [
    {
      label: "Home",
      icon: "pi pi-home",
      command: () => (navigate("/home")),
    },
    {
      label: "Moje instrukcije",
      icon: "pi pi-book",
      command: () => (navigate("/home")),
    },
    {
      label: "Postavke",
      icon: "pi pi-cog",
      command: () => (navigate("/home")),
    },
    {
      label: "Moj profil",
      icon: "pi pi-user",
      command: () => (navigate("/home")),
    },
    {
      label: "Odjavi se",
      icon: "pi pi-sign-out",
      command: logout,
    },
  ];

  const start = (
    <img
      alt="logo"
      src="/logo/dotInstrukcije-logo.png"
      height="40"
      className="navbar-logo"
    />
  );

  return (
    <div className="navbar-container">
      {loggedIn && (
        <div className="navbar-wrapper">
          {!isSmallScreen && (
            <div className="desktop-navbar">
              <Menubar model={items.filter(Boolean)} start={start} />
            </div>
          )}

          {isSmallScreen && (
            <div className="mobile-navbar">
              <Button
                icon="pi pi-bars"
                className="p-button-primary sidebar-toggle-button"
                onClick={() => setVisibleSidebar(true)}
              />
            </div>
          )}

          <Sidebar
            visible={visibleSidebar}
            onHide={() => setVisibleSidebar(false)}
            position="left"
            className="custom-sidebar"
            modal
          >
            <div className="sidebar-content">
              <ul className="sidebar-list">
                {items.map(
                  (item, index) =>
                    item && (
                      <li key={index} className="sidebar-item">
                        <Button
                          label={item.label}
                          icon={item.icon}
                          className="p-button-link sidebar-button"
                          onClick={() => {
                            item.command();
                            setVisibleSidebar(false);
                          }}
                        />
                      </li>
                    )
                )}
              </ul>
            </div>
          </Sidebar>
        </div>
      )}
    </div>
  );
}

export default HomePage;
