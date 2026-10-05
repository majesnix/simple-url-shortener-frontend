import type { ParentComponent } from "solid-js";
import Nav from "./components/Nav";

const App: ParentComponent = (props) => {
  return (
    <div class="relative min-h-full">
      {props.children}
      <Nav />
      <span class="absolute bottom-6 left-6 text-text-3 text-xs font-mono">v2</span>
    </div>
  );
};

export default App;
