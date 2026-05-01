import { Show, createSignal, onMount } from "solid-js";
import notFoundImage from "../assets/404.jpg";
import Wrapper from "../components/Wrapper";

const ResolveUrl = () => {
  const [notFound, setNotFound] = createSignal(false);
  onMount(async () => {
    const slug = location.pathname.split("/").filter(Boolean)[0] ?? "";
    const url = await fetch(`${import.meta.env.VITE_API}/${slug}`)
      .then(async (response) => {
        if (response.ok) {
          return (await response.json()).url;
        }
      })
      .catch((err) => {
        console.error(err);
        setNotFound(true);
      });

    if (url) {
      try {
        const parsed = new URL(url);
        if (parsed.protocol === "http:" || parsed.protocol === "https:") {
          window.location.href = url;
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      }
    } else {
      setNotFound(true);
    }
  });

  return (
    <Wrapper>
      <Show when={notFound()}>
        <img src={notFoundImage} />
      </Show>
    </Wrapper>
  );
};

export default ResolveUrl;
