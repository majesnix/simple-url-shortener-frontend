import { styled } from "@macaron-css/solid";
import "./InputUrl.css";
import { Show, createSignal, onMount } from "solid-js";
import { writeClipboard } from "@solid-primitives/clipboard";

const Wrapper = styled("div", {
  base: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});

const InputWrapper = styled("div", {
  base: {
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

const Short = styled("div", {
  base: {
    color: "white",
    marginTop: "8px",
  },
});

const InputUrl = () => {
  const [url, setUrl] = createSignal("");
  const [short, setShort] = createSignal("");

  const shorten = async () => {
    const { short } = (await fetch(import.meta.env.VITE_API, {
      method: "POST",
      body: JSON.stringify({ url: url() }),
    }).then(async (response) => await response.json())) as { short: string };

    setShort("https://" + import.meta.env.VITE_BASE + "/" + short);
  };

  onMount(() => {
    const input = document.getElementById("input")! as HTMLInputElement;
    input.value = "https://";
    input.focus();
  });

  return (
    <Wrapper>
      <InputWrapper>
        <Input
          id="input"
          placeholder="https://.."
          onInput={(e) => setUrl(e.target.value)}
        ></Input>
        <button class="shorten-button" onClick={shorten}>
          Shorten
        </button>
      </InputWrapper>
      <Show when={short()}>
        <Short onClick={() => writeClipboard(short())}>{short()}</Short>
      </Show>
    </Wrapper>
  );
};

export default InputUrl;
