import type { Component, JSX } from "solid-js";

import Nav from "./components/Nav";
import { styled } from "@macaron-css/solid";

const Wrapper = styled("div", {
  base: {
    height: "100%",
  },
});

const Version = styled("div", {
  base: {
    color: "white",
    position: "absolute",
    bottom: "1.5rem",
    left: "1.5rem",
  },
});

interface Props extends JSX.ButtonHTMLAttributes<HTMLDivElement> {}

const App: Component = (props: Props) => {
  return (
    <Wrapper>
      {props.children}
      <Nav />
      <Version>v2</Version>
    </Wrapper>
  );
};

export default App;
