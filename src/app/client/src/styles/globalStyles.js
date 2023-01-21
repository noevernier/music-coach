import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    *, *::before, *::after {
        margin: 0;
        box-sizing: border-box;
    }

    body {
        background: ${({ theme }) => theme.bg2};
        color: ${({ theme }) => theme.text};
        font-family: 'Roboto', sans-serif;
        letter-spacing: .6px;
    }

    .logo {
        border-radius: 20%;
        box-shadow: ${({ theme }) => theme.bg2} 0px 2px 4px, ${({ theme }) => theme.bg2} 0px 7px 13px -3px, ${({ theme }) => theme.bg2} 0px -3px 0px inset;
    }

    .logo:hover {
        box-shadow: ${({ theme }) => theme.bg2} 0px 2px 4px, ${({ theme }) => theme.bg2} 0px 7px 13px -3px, ${({ theme }) => theme.bg2} 0px 0px 0px inset;
    }
`;
