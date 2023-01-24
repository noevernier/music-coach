import styled from "styled-components";
import { btnReset, v } from "../../styles/variables";

export const SMenuBar = styled.div`
    background: ${({ theme }) => theme.bg};
    width: ${({ isOpen }) => (!isOpen ? `auto` : v.sidebarWidth)};
    position: relative;
`;