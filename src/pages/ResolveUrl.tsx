import { Show, createSignal, onMount } from "solid-js";
import notFoundImage from "../assets/404.jpg";
import { Wrapper } from "../components/Wrapper";

const ResolveUrl = () => {
  const [notFound, setNotFound] = createSignal(false);
  onMount(async () => {
    const url = await fetch(
      `${import.meta.env.VITE_API}/${location.pathname.replace("/", "")}`
    )
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
      if (!url.includes("http") || !url.includes("https")) {
        window.location.href = "https://" + url;
      } else {
        window.location.href = url;
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
