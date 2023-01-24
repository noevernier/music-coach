import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import MenuBar from "../MenuBar/MenuBar";
import { SLayoutMenuBar, SLayoutSideBar, SMain } from "./styles";

const Layout = ({ children }) => {
    return (
        <SLayoutSideBar>
            <Sidebar />
            <SLayoutMenuBar>
                <MenuBar />
                <SMain>{children}</SMain>
            </SLayoutMenuBar>
        </SLayoutSideBar>
    );
};

export default Layout;
