import { Show, createEffect, createSignal, onMount } from "solid-js";
import { writeClipboard } from "@solid-primitives/clipboard";
import toast, { Toaster } from "solid-toast";
import { useKeyDownEvent } from "@solid-primitives/keyboard";
import Wrapper from "../components/Wrapper";

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
      <h1 class="font-display text-4xl font-bold tracking-tight text-text-1 mb-2 m-0">
        {import.meta.env.VITE_BASE}
      </h1>
      <p class="text-text-3 text-sm mb-8 mt-1 tracking-wide">makes links short.</p>
      <div class="flex items-center gap-3">
        <input
          id="input"
          class="h-10 w-80 bg-surface-2 border border-white/8 rounded-md px-4 text-text-1 text-sm placeholder:text-text-3 focus:outline-none focus:ring-2 focus:ring-accent/35 focus:border-transparent transition-all"
          onInput={(e) => setUrl(e.target.value)}
        />
        <div class="relative">
          <select
            class="appearance-none h-10 bg-surface-2 border border-white/8 rounded-md pl-3 pr-8 text-text-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/35 focus:border-transparent transition-all"
            onChange={(e) => setExpiry(e.target.value)}
          >
            {EXPIRY_OPTIONS.map((opt) => (
              <option value={opt.value} class="bg-surface-2">
                {opt.label}
              </option>
            ))}
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-text-3">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
        <button
          class="h-10 px-5 bg-accent hover:bg-accent-dim text-white text-sm font-semibold rounded-md cursor-pointer border-none transition-all duration-200 active:scale-[0.97] hover:shadow-[0_0_24px_rgba(123,108,246,0.18)] focus:outline-none focus:ring-2 focus:ring-accent/35"
          onClick={shorten}
        >
          Shorten
        </button>
      </div>
      <Show when={short()}>
        <button
          class="mt-6 font-mono text-teal text-sm hover:text-teal/80 transition-colors cursor-pointer bg-transparent border-none p-0"
          onClick={shortUrlClickHandler}
        >
          {short()}
        </button>
      </Show>
      <Toaster />
    </Wrapper>
  );
};

export default InputUrl;
