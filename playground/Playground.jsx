import { Fragment, memo } from "react";
import { useParams, removeParam, setParam, pmask } from "./useparams";

const ChildComponent = memo(function ChildComponent() {
  console.log({ pmask });
  const { name, itemId, undef } = useParams({
    name: "3",
    itemId: pmask.num,
    str: pmask.str,
    undef: pmask.bool,
  });
  console.log({ child: { name, itemId, undef } });
  return (
    <Fragment>
      <br />
      <b>CHILDREN-----</b>
      <b>NAME: {name}</b>
      <b>itemId: {itemId}</b>
      <button onClick={() => setParam("name", name + "O")}>
        Update name state
      </button>
      <button onClick={() => setParam("name", "BIM")}>name=BIM</button>
      <button onClick={() => setParam("name")}>name=undefined</button>
      <button onClick={() => setParam("itemId", "CHILD")}>
        Change itemId=CHILD
      </button>
      <button onClick={() => setParam("itemId", undefined)}>
        Change itemId=undefined
      </button>
      <button onClick={() => removeParam("itemId")}>Remove itemId</button>
    </Fragment>
  );
});

function Playground() {
  const params = useParams({
    uno: "my-default",
    count: 0,
    itemId: 2,
  });
  console.log({ parent: params });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        margin: "0 auto",
        maxWidth: 666,
      }}
    >
      <b>Count: {params.count}</b>
      <b>itemId: {params.itemId}</b>
      <button onClick={() => removeParam("count")}>Remove count</button>
      <button onClick={() => setParam("count", params.count + 1)}>
        Update param count+1
      </button>
      <button onClick={() => setParam("count", params.count - 1)}>
        Update param count-1
      </button>
      <button onClick={() => setParam("itemId", "ABC")}>
        Change itemId=ABC
      </button>
      <button onClick={() => setParam("count", 999)}>Set param to 999</button>
      <ChildComponent />
    </div>
  );
}

export default Playground;
