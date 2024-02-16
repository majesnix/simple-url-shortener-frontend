import { Show, createSignal, onMount } from "solid-js";

const ResolveUrl = () => {
  const [notFound, setNotFound] = createSignal(false);
  onMount(async () => {
    const url = await fetch(
      `${import.meta.env.VITE_API}/${location.pathname.replace("/", "")}`
    ).then(async (response) => {
      if (response.ok) {
        return (await response.json()).url;
      }
    });

    if (url) {
      if (!url.includes("http") || !url.includes("https")) {
        window.location.href = "https://" + url;
      } else {
        window.location.href = url;
      }
    }
  });

  return <Show when={notFound()}>NOT FOUND</Show>;
};

export default ResolveUrl;
