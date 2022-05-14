import { useParams, removeParam, setParam } from "@dev/useparams";

function App() {
  const params = useParams({
    uno: "my-default",
    count: 0,
    "item-id": "some-random-id",
  });
  return (
    <div>
      <b>Count: {params.count}</b>
      <b>ID: {params["item-id"]}</b>
      <button onClick={() => removeParam("count")}>Remove</button>
      <button
        onClick={() => setParam("count", parseInt(params.count) + 1 || 0)}
      >
        Update param count
      </button>
    </div>
  );
}

export default App;
