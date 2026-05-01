import type { ParentComponent } from "solid-js";

const Wrapper: ParentComponent = (props) => (
  <div class="min-h-screen flex flex-col justify-center items-center">
    {props.children}
  </div>
);

export default Wrapper;
