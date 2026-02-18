import { signal } from "@preact/signals";

export function App() {
  const count = signal(0);

  const handleClick = () => {
    count.value++;
  };

  return (
    <>
      <h1 class="text-3xl font-bold underline">Hello world!</h1>
      <p>{count}</p>
      <button
        class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        onClick={handleClick}
      >
        Increment
      </button>
    </>
  );
}
