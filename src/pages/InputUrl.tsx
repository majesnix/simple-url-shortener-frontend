import { styled } from "@macaron-css/solid";
import "./InputUrl.scss";
import { Show, createEffect, createSignal, onMount } from "solid-js";
import { writeClipboard } from "@solid-primitives/clipboard";
import toast, { Toaster } from "solid-toast";
import { useKeyDownEvent } from "@solid-primitives/keyboard";
import Wrapper from "../components/Wrapper";

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
    marginRight: "1rem",
    height: "2.5rem",
  },
});

const Short = styled("div", {
  base: {
    color: "white",
    marginTop: "8px",
    ":hover": {
      cursor: "pointer",
    },
  },
});

const Header = styled("h1", {
  base: {
    color: "white",
  },
});

const InputUrl = () => {
  const keys = useKeyDownEvent();

  const [url, setUrl] = createSignal("");
  const [short, setShort] = createSignal("");

  const shorten = async () => {
    try {
      const { short } = await fetch(import.meta.env.VITE_API, {
        method: "POST",
        body: JSON.stringify({ url: url() }),
      }).then(async (response) => {
        if (response.ok) {
          return (await response.json()) as { short: string };
        } else {
          if (response.status === 400) {
            toast.error("Invalid URL");
            throw new Error("Invalid URL");
          } else {
            toast.error("Something went wrong");
            throw new Error("Something went wrong");
          }
        }
      });

      setShort("https://" + import.meta.env.VITE_BASE + "/" + short);
    } catch (error) {}
  };

  const shortUrlClickHandler = () => {
    writeClipboard(short());
    toast.success("Copied to clipboard!");
  };

  onMount(() => {
    const input = document.getElementById("input")! as HTMLInputElement;
    input.value = "https://";
    input.focus();
  });

  createEffect(async () => {
    const pressed = keys();
    if (pressed?.key == "Enter") {
      await shorten();
      shortUrlClickHandler();
    }
  });

  return (
    <Wrapper>
      <Header>{import.meta.env.VITE_BASE}</Header>
      <InputWrapper>
        <Input id="input" onInput={(e) => setUrl(e.target.value)}></Input>
        <button class="btn draw-border" onClick={shorten}>
          Shorten
        </button>
      </InputWrapper>
      <Show when={short()}>
        <Short onClick={shortUrlClickHandler}>{short()}</Short>
      </Show>
      <Toaster />
    </Wrapper>
  );
};

export default InputUrl;
