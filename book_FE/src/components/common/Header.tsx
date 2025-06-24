import { styled } from "styled-components";

function Header() {
  return (
    <HeaderStyled>
      <h1>Book store Header</h1>
    </HeaderStyled>
  );
}

const HeaderStyled = styled.header`
  background-color: ${({ theme }) => theme.color.background};

  h1 {
    color: ${({ theme }) => theme.color.text};
  }
`;

export default Header;
