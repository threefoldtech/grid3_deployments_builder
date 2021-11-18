import { Updater, writable } from "svelte/store";
import {NetworkEnv} from "grid3_client"
interface IState {
  mnemonics: string;
  networkEnv: NetworkEnv;
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
      networkEnv: NetworkEnv.dev,
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
        value.networkEnv =  e.target.options[e.target.options.selectedIndex].value;;
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
