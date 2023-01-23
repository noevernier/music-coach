import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import MenuBar from "../MenuBar/MenuBar";
import { SLayout, SMain } from "./styles";

const Layout = ({ children }) => {
    return (
        <SLayout>
            <Sidebar />
            <MenuBar />
            <SMain>{children}</SMain>
        </SLayout>
    );
};

export default Layout;
