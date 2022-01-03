import { Updater, writable } from "svelte/store";
interface IState {
  mnemonics: string;
  networkEnv: string;
  kvSecret: string;
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
      networkEnv: "dev",
      kvSecret: "",
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

    updateNetworkEnv(e: any) {
      return update((value) => {
        console.log(e.detail);
        value.networkEnv = e.detail.value;
        return value;
      });
    },

    updateKvSecret(e: any) {
      return update((value) => {
        value.kvSecret = e.target.value;
        return value;
      });
    },
  };
}

export default createMnemonicsStore();
