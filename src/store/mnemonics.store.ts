import { Updater, writable } from "svelte/store";

interface IState {
  mnemonics: string;
  proxyUrl: string;
  explorerUrl: string;
}

function createMnemonicsStore() {
  let initData: IState;
  try {
    const data = localStorage.getItem("mnemonics");
    if (data) {
      initData = JSON.parse(data);
    }
  } catch {}
  const store = writable<IState>(
    initData || {
      mnemonics: "",
      proxyUrl: "https://rmbproxy1.devnet.grid.tf",
      explorerUrl: "wss://tfchain.dev.threefold.io",
    }
  );
  const { subscribe } = store;

  function update(updater: Updater<IState>): void {
    store.update((value) => {
      const newValue = updater(value);
      localStorage.setItem("mnemonics", JSON.stringify(newValue));
      return newValue;
    });
  }

  return {
    subscribe,
    updateMnemonics(e: any) {
      return update((value) => {
        value.mnemonics = e.target.value;
        return value;
      });
    },

    updateProxyUrl(e: any) {
      return update((value) => {
        value.proxyUrl = e.target.value;
        return value;
      });
    },

    updateExplorerUrl(e: any) {
      return update((value) => {
        value.explorerUrl = e.target.value;
        return value;
      });
    },
  };
}

export default createMnemonicsStore();
