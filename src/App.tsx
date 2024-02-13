import type { Component, JSX } from "solid-js";

import Nav from "./components/Nav";
import { styled } from "@macaron-css/solid";

const Wrapper = styled("div", {
  base: {
    height: "100%",
  },
});

interface Props extends JSX.ButtonHTMLAttributes<HTMLDivElement> {}

const App: Component = (props: Props) => {
  return (
    <Wrapper>
      {props.children}
      <Nav />
    </Wrapper>
  );
};

export default App;
