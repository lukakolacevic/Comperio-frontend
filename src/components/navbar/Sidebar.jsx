import React, { useState, useRef } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Ripple } from 'primereact/ripple';
import { StyleClass } from 'primereact/styleclass';
import { useMediaQuery } from 'react-responsive';

export default function ResponsiveSidebar() {
    const [visible, setVisible] = useState(false);
    const btnRef1 = useRef(null);
    const btnRef4 = useRef(null);

    const isSmallScreen = useMediaQuery({ maxWidth: 768 });

    return (
        <div className="card flex justify-content-center">
            {/* Toggle button for small screens */}
            {isSmallScreen && (
                <Button
                    icon="pi pi-bars"
                    onClick={() => setVisible(true)}
                    className="sidebar-toggle-button"
                />
            )}

            <Sidebar
                visible={isSmallScreen ? visible : true}
                onHide={() => setVisible(false)}
                modal={isSmallScreen}
                dismissable={isSmallScreen}
                className="custom-sidebar"
            >
                <div className="min-h-screen flex flex-column">
                    <div className="flex align-items-center justify-content-between px-4 pt-3">
                        <span className="inline-flex align-items-center gap-2">
                            <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Insert logo SVG here */}
                                <path d="..." fill="var(--primary-color)" />
                            </svg>
                            <span className="font-semibold text-2xl text-primary">Your Logo</span>
                        </span>
                        {isSmallScreen && (
                            <Button
                                type="button"
                                onClick={() => setVisible(false)}
                                icon="pi pi-times"
                                className="h-2rem w-2rem"
                            />
                        )}
                    </div>

                    <div className="overflow-y-auto">
                        {/* Favorites Section */}
                        <ul className="list-none p-3 m-0">
                            <li>
                                <StyleClass nodeRef={btnRef1} selector="@next" enterClassName="hidden" enterActiveClassName="slidedown" leaveToClassName="hidden" leaveActiveClassName="slideup">
                                    <div ref={btnRef1} className="p-ripple p-3 flex align-items-center justify-content-between text-600 cursor-pointer">
                                        <span className="font-medium">FAVORITES</span>
                                        <i className="pi pi-chevron-down"></i>
                                        <Ripple />
                                    </div>
                                </StyleClass>
                                <ul className="list-none p-0 m-0 overflow-hidden">
                                    <li>
                                        <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 transition-colors w-full">
                                            <i className="pi pi-home mr-2"></i>
                                            <span className="font-medium">Dashboard</span>
                                            <Ripple />
                                        </a>
                                    </li>
                                    <li>
                                        <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 transition-colors w-full">
                                            <i className="pi pi-bookmark mr-2"></i>
                                            <span className="font-medium">Bookmarks</span>
                                            <Ripple />
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>

                        {/* Application Section */}
                        <ul className="list-none p-3 m-0">
                            <li>
                                <StyleClass nodeRef={btnRef4} selector="@next" enterClassName="hidden" enterActiveClassName="slidedown" leaveToClassName="hidden" leaveActiveClassName="slideup">
                                    <div ref={btnRef4} className="p-ripple p-3 flex align-items-center justify-content-between text-600 cursor-pointer">
                                        <span className="font-medium">APPLICATION</span>
                                        <i className="pi pi-chevron-down"></i>
                                        <Ripple />
                                    </div>
                                </StyleClass>
                                <ul className="list-none p-0 m-0 overflow-hidden">
                                    <li>
                                        <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 transition-colors w-full">
                                            <i className="pi pi-folder mr-2"></i>
                                            <span className="font-medium">Projects</span>
                                            <Ripple />
                                        </a>
                                    </li>
                                    {/* Add more nested items here if needed */}
                                </ul>
                            </li>
                        </ul>
                    </div>

                    {/* Profile Section at the Bottom */}
                    <div className="mt-auto profile-section">
                        <hr className="mb-3 mx-3 border-top-1 border-none surface-border" />
                        <a className="m-3 flex align-items-center cursor-pointer p-3 gap-2 border-round text-700 transition-colors p-ripple">
                            <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" />
                            <span className="font-bold">Amy Elsner</span>
                        </a>
                    </div>
                </div>
            </Sidebar>
        </div>
    );
}
