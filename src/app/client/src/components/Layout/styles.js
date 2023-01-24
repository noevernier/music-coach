import styled from "styled-components";

import { v } from "../../styles/variables";

export const SLayoutSideBar = styled.div`
    display: flex;
`;

export const SMain = styled.main`
    padding: calc(${v.smSpacing} * 2);

    h1 {
        font-size: 14px;
    }
`;

export const SLayoutMenuBar = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;`;
