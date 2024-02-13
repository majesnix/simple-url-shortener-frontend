import { styled } from "@macaron-css/solid";
import "./InputUrl.css";

const Wrapper = styled("div", {
  base: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

const Input = styled("input", {
  base: {
    fontSize: "1.8rem",
    width: "25rem",
  },
});

const InputUrl = () => (
  <Wrapper>
    <Input placeholder="https://.."></Input>
    <button class="shorten-button">Shorten</button>
  </Wrapper>
);

export default InputUrl;
