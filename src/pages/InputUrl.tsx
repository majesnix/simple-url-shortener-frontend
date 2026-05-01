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

const Select = styled("select", {
  base: {
    fontSize: "1rem",
    height: "2.5rem",
    marginRight: "1rem",
    padding: "0 0.5rem",
    background: "#1f1a25",
    color: "white",
    border: "1px solid #58afd1",
    cursor: "pointer",
  },
});

const EXPIRY_OPTIONS = [
  { value: "unlimited", label: "No expiry" },
  { value: "1d", label: "1 day" },
  { value: "1w", label: "1 week" },
  { value: "1m", label: "1 month" },
  { value: "1y", label: "1 year" },
] as const;

const InputUrl = () => {
  const keys = useKeyDownEvent();

  const [url, setUrl] = createSignal("");
  const [short, setShort] = createSignal("");
  const [expiry, setExpiry] = createSignal<string>("unlimited");

  const shorten = async () => {
    const expiryValue = expiry();
    const body: Record<string, string> = { url: url() };
    if (expiryValue !== "unlimited") body.expiry = expiryValue;

    const result = await fetch(import.meta.env.VITE_API, {
      method: "POST",
      body: JSON.stringify(body),
    }).then(async (response) => {
      if (response.ok) {
        return (await response.json()) as { short: string };
      } else {
        if (response.status === 400) {
          toast.error("Invalid URL");
          console.error("Invalid URL");
        } else {
          toast.error("Something went wrong");
          console.error("Something went wrong");
        }
        return null;
      }
    });

    if (!result) return;
    setShort("https://" + import.meta.env.VITE_BASE + "/" + result.short);
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
        <Select onChange={(e) => setExpiry(e.target.value)}>
          {EXPIRY_OPTIONS.map((opt) => (
            <option value={opt.value}>{opt.label}</option>
          ))}
        </Select>
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
