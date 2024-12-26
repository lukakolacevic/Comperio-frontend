import React, { useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { useMediaQuery } from 'react-responsive';
import { logout } from '../../api/AuthApi';
import './Navbar.css';

function HomePage() {
    //const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const loggedIn = Boolean(user);

    const [visibleSidebar, setVisibleSidebar] = useState(false);
    const isSmallScreen = useMediaQuery({ maxWidth: 768 });

    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            command: () => window.location.href = '/'
        },
        {
            label: 'Moje instrukcije',
            icon: 'pi pi-book',
            command: () => window.location.href = '/my-sessions'
        },
        {
            label: 'Postavke',
            icon: 'pi pi-cog',
            command: () => window.location.href = '/settings'
        },
        {
            label: 'Moj profil',
            icon: 'pi pi-user',
            command: () => window.location.href = '/profile'
        },
        user?.status === 'professor' && {
            label: 'Novi predmet',
            icon: 'pi pi-plus',
            command: () => window.location.href = '/new'
        },
        {
            label: 'Odjavi se',
            icon: 'pi pi-sign-out',
            command: logout
        }
    ];

    const start = <img alt="logo" src="/logo/dotInstrukcije-logo.png" height="40" className="navbar-logo" />;

    return (
        <div className="navbar-container">
            {loggedIn && (
                <div className="navbar-wrapper">
                    {/* Desktop Menubar - Centered */}
                    {!isSmallScreen && (
                        <div className="desktop-navbar">
                            <Menubar model={items.filter(Boolean)} />
                        </div>
                    )}

                    {/* Mobile Sidebar Toggle Button */}
                    {isSmallScreen && (
                        <div className="mobile-navbar">
                            <Button
                                icon="pi pi-bars"
                                className="p-button-primary sidebar-toggle-button"
                                onClick={() => setVisibleSidebar(true)}
                            />
                        </div>
                    )}

                    {/* Sidebar for Mobile */}
                    <Sidebar
                        visible={visibleSidebar}
                        onHide={() => setVisibleSidebar(false)}
                        position="left"
                        className="custom-sidebar"
                        modal
                    >
                        <div className="sidebar-content">
                            <ul className="sidebar-list">
                                {items.map((item, index) => (
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
                                ))}
                            </ul>
                        </div>
                    </Sidebar>
                </div>
            )}
        </div>

    );
}

export default HomePage;
