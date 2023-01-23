import React, { useContext, useState } from "react";
import {
    SDivider,
    SLink,
    SLinkContainer,
    SLinkIcon,
    SLinkLabel,
    SLogo,
    STextLogo,
    SSidebar,
    SSidebarButton,
    STheme,
    SThemeLabel,
    SThemeToggler,
    SToggleThumb,
} from "./styles";

import { logoPNG } from "../../assets";

import {
    AiOutlineLeft,
    AiOutlineSetting,
} from "react-icons/ai";

import {FiEdit} from "react-icons/fi";
import { MdOutlineAnalytics } from "react-icons/md";
import { BsMic } from "react-icons/bs";

import { ThemeContext } from "./../../App";
import { useLocation } from "react-router-dom";

const Sidebar = () => {
    const { setTheme, theme } = useContext(ThemeContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { pathname } = useLocation();


    return (
        <SSidebar isOpen={sidebarOpen}>
            <>
                <SSidebarButton isOpen={sidebarOpen} onClick={() => setSidebarOpen((p) => !p)}>
                    <AiOutlineLeft />
                </SSidebarButton>
            </>


            <SLogo>
                <img class="logo" src={logoPNG} alt="logo" />
                {sidebarOpen && <STextLogo>{"MusiCoach"}</STextLogo>}
            </SLogo>

            <SDivider />


            {linksArray.map(({ icon, label, to }) => (
                <SLinkContainer key={label} isActive={pathname === to}>
                    <SLink to={to} style={!sidebarOpen ? { width: `fit-content` } : {}}>
                        <SLinkIcon>{icon}</SLinkIcon>
                        {sidebarOpen && (
                            <>
                                <SLinkLabel>{label}</SLinkLabel>
                            </>
                        )}
                    </SLink>
                </SLinkContainer>
            ))}


            <SDivider />


            {secondaryLinksArray.map(({ icon, label }) => (
                <SLinkContainer key={label}>
                    <SLink to="/" style={!sidebarOpen ? { width: `fit-content` } : {}}>
                        <SLinkIcon>{icon}</SLinkIcon>
                        {sidebarOpen && <SLinkLabel>{label}</SLinkLabel>}
                    </SLink>
                </SLinkContainer>
            ))}

            <SDivider />


            <STheme>
                {sidebarOpen && <SThemeLabel>Dark Mode</SThemeLabel>}
                <SThemeToggler
                    isActive={theme === "dark"}
                    onClick={() => setTheme((p) => (p === "light" ? "dark" : "light"))}
                >
                    <SToggleThumb style={theme === "dark" ? { right: "1px" } : {}} />
                </SThemeToggler>
            </STheme>

            
        </SSidebar>
    );
};

const linksArray = [
    {
        label: "Editor",
        icon: <FiEdit />,
        to: "/"
    },
    {
        label: "Musics",
        icon: <MdOutlineAnalytics />,
        to: "/musics"
    },
    {
        label: "Record",
        icon: <BsMic />,
        to: "/record"
    }
];

const secondaryLinksArray = [
    {
        label: "Settings",
        icon: <AiOutlineSetting />,
    }
];

export default Sidebar;
