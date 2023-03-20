import styled from "styled-components";
import { btnReset, v } from "../styles/variables";

export const SCenteredContainer = styled.div`
    position : absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); 
    display: flex;
    align-items: center;
    justify-content: center;`;

export const SRecordButton = styled.button`
    ${btnReset};
    position: relative;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: ${({ theme }) => theme.bg};
    box-shadow: 0 0 4px ${({ theme }) => theme.bg3}, 0 0 7px ${({ theme }) => theme.bg};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    :hover {
        box-shadow: inset 0 0 0 1px ${({ theme }) => theme.bg3};
    }`;

export const SAudio = styled.audio`
    position: relative;
    background: ${({ theme }) => theme.bg};
    box-shadow: 0 0 4px ${({ theme }) => theme.bg3}, 0 0 7px ${({ theme }) => theme.bg};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    `

export const SPageContainer = styled.div`
    width: auto;
    height: auto;
    margin : 0;`;
