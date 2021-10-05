import { writable } from "svelte/store";

function createMnemonicsStore() {
  const store = writable(localStorage.getItem("mnemonics") || "");
  const { subscribe } = store;

  function set(value: string): void {
    store.set(value);

    console.log(value);

    localStorage.setItem("mnemonics", value);
  }

  return {
    subscribe,
    set,
  };
}

export default createMnemonicsStore();
