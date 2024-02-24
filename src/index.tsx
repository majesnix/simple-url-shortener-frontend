/* @refresh reload */
import { render } from "solid-js/web";

import "./index.scss";

import App from "./App";
import { Route, Router } from "@solidjs/router";
import Terms from "./pages/Terms";
import ResolveUrl from "./pages/ResolveUrl";
import { MetaProvider, Title } from "@solidjs/meta";
import InputUrl from "./pages/InputUrl";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(
  () => (
    <MetaProvider>
      <Title>{import.meta.env.VITE_BASE}</Title>
      <Router root={App}>
        <Route path="/" component={InputUrl} />
        <Route path="/terms" component={Terms} />
        <Route path="*404" component={ResolveUrl} />
      </Router>
    </MetaProvider>
  ),
  root!
);
