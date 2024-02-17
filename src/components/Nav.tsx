import { styled } from "@macaron-css/solid";

const NavWrapper = styled("nav", {
  base: {
    position: "absolute",
    right: 0,
    bottom: 0,
    margin: "0 1.5rem 1.5rem 0",
    display: "flex",
    gap: "16px",
  },
});

const Link = styled("a", {
  base: { textDecoration: "none", color: "#FBFBFB", cursor: "pointer" },
});

const Version = styled("div", {
  base: {
    color: "white",
  },
});

const Nav = () => (
  <NavWrapper>
    <Link href="/">Home</Link>
    <Link href="/terms">Terms</Link>
    <Version>v2</Version>
  </NavWrapper>
);

export default Nav;
