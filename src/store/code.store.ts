import type { Updater } from "svelte/store";
import { writable } from "svelte/store";

import {
  Project,
  Env,
  Resource,
  Disk,
  VM,
  Mount,
  ZDB,
  Network,
  Master,
  Worker,
} from "../models";

export type Add_Types =
  | "project"
  | "resource"
  | "disks"
  | "vms"
  | "mounts"
  | "env_vars"
  | "zdbs"
  | "master"
  | "worker"
  | "network"
  | "kubernetes";

export interface IStore {
  active: number;
  projects: Project[];
}

function createCodeStore() {
  let initData: IStore;
  try {
    let data = localStorage.getItem("store");
    if (data) {
      initData = JSON.parse(data);
    }
  } catch {}

  const store = writable<IStore>(
    initData || {
      active: -1,
      projects: [],
    }
  );
  const { subscribe, set } = store;

  function update(updater: Updater<IStore>): void {
    store.update((value) => {
      const newValue = updater(value);
      localStorage.setItem("store", JSON.stringify(newValue));
      return newValue;
    });
  }

  return {
    subscribe,
    set,
    setActiveProject(active: number) {
      return update((value) => {
        return { ...value, active };
      });
    },
    add(type: Add_Types, resourceIdx?: number, idx?: number) {
      return update((value) => {
        // prettier-ignore
        if (type == "disks" || type == "vms" || type == "master" || type == "worker" || type == "zdbs")
          if (resourceIdx == undefined && value.projects[value.active].resources.length === 1)
            resourceIdx = 0;

        // prettier-ignore
        if (type == "mounts" || type == "env_vars")
          if (resourceIdx != undefined && idx == undefined && value.projects[value.active].resources[resourceIdx].vms.length === 1)
            idx = 0;

        switch (type) {
          case "project":
            value.active = value.projects.push(new Project()) - 1;
            break;

          case "zdbs":
            if (resourceIdx != undefined)
              value.projects[value.active].resources[resourceIdx].zdbs.push(new ZDB()); // prettier-ignore
            break;

          case "master":
            if (resourceIdx != undefined) 
              value.projects[value.active].resources[resourceIdx].masters.push(new Master()); // prettier-ignore
            break;

          case "worker":
            if (resourceIdx != undefined)
              value.projects[value.active].resources[resourceIdx].workers.push(new Worker()); // prettier-ignore
            break;

          case "resource":
            value.projects[value.active].resources.push(new Resource());
            break;

          case "disks":
            if (resourceIdx != undefined)
              value.projects[value.active].resources[resourceIdx].disks.push(new Disk()); // prettier-ignore
            break;

          case "vms":
            if (resourceIdx != undefined)
              value.projects[value.active].resources[resourceIdx].vms.push(new VM()); // prettier-ignore
            break;

          case "mounts":
            if (resourceIdx != undefined && idx != undefined)
              value.projects[value.active].resources[resourceIdx].vms[idx].mounts.push(new Mount()); // prettier-ignore
            break;

          case "env_vars":
            if (resourceIdx != undefined && idx != undefined)
              value.projects[value.active].resources[resourceIdx].vms[idx].env_vars.push(new Env()); // prettier-ignore
            break;

          case "network":
            value.projects[value.active].network = new Network();
            break;

          case "kubernetes":
            value.projects[value.active].resources.push(
              new Resource(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                [new Master()],
                [new Worker(), new Worker(), new Worker(), new Worker()]
              )
            );
            break;
        }
        return value;
      });
    },

    updateResource<R extends keyof Resource>(key: R, idx: number) {
      return (e: any) => {
        return update((value) => {
          const { type, value: val } = e.target;
          value.projects[value.active].resources[idx][key] = type === "number" ? +val : val; // prettier-ignore
          return value;
        });
      };
    },

    updateDisk<R extends keyof Disk>(
      resourceIdx: number,
      index: number,
      key: R
    ) {
      return (e: any) => {
        return update((value) => {
          const { type, value: val } = e.target;
          value.projects[value.active].resources[resourceIdx].disks[index][key] = type === "number" ? +val : val; // prettier-ignore
          return value;
        });
      };
    },

    updateVm<R extends keyof VM>(resourceIdx: number, index: number, key: R) {
      return (e: any) => {
        return update((value) => {
          const { type, value: val } = e.target;
          value.projects[value.active].resources[resourceIdx].vms[index][key] = type === "number" ? +val : val; // prettier-ignore
          return value;
        });
      };
    },

    updateMounts<R extends keyof Mount>(
      resourceIdx: number,
      vm_index: number,
      index: number,
      key: R
    ) {
      return (e: any) => {
        return update((value) => {
          const { type, value: val } = e.target;
          value.projects[value.active].resources[resourceIdx].vms[vm_index].mounts[index][key] = type === "number" ? +val : val; // prettier-ignore
          return value;
        });
      };
    },

    updateEnv<R extends keyof Env>(
      resourceIdx: number,
      vm_index: number,
      index: number,
      key: R
    ) {
      return (e: any) => {
        return update((value) => {
          const { type, value: val } = e.target;
          value.projects[value.active].resources[resourceIdx].vms[vm_index].env_vars[index][key] = type === "number" ? +val : val; // prettier-ignore
          return value;
        });
      };
    },

    updateZdb<R extends keyof ZDB>(resourceIdx: number, index: number, key: R) {
      return (e: any) => {
        return update((value) => {
          const { type, value: val } = e.target;
          value.projects[value.active].resources[resourceIdx].zdbs[index][key] = type === "number" ? +val : val; // prettier-ignore
          return value;
        });
      };
    },

    updateMaster<R extends keyof Master>(
      resourceIdx: number,
      index: number,
      key: R
    ) {
      return (e: any) => {
        return update((value) => {
          const { type, value: val } = e.target;
          value.projects[value.active].resources[resourceIdx].masters[index][key] = type === "number" ? +val : val; // prettier-ignore
          return value;
        });
      };
    },

    updateWorker<R extends keyof Worker>(
      resourceIdx: number,
      index: number,
      key: R
    ) {
      return (e: any) => {
        return update((value) => {
          const { type, value: val } = e.target;
          value.projects[value.active].resources[resourceIdx].workers[index][key] = type === "number" ? +val : val; // prettier-ignore
          return value;
        });
      };
    },

    updateNetwork<R extends keyof Network>(key: R) {
      return (e: any) => {
        return update((value) => {
          const { type, value: val } = e.target;
          if (key === "node") {
            value.projects[value.active].network.node = val
              .split(",")
              .map((v) => v.trim())
              .map((v) => +v)
              .filter((v) => !isNaN(v));
          } else {
            value.projects[value.active].network[key] = type === "number" ? +val : val; // prettier-ignore
          }
          return value;
        });
      };
    },

    removeFromResource(resourceIdx: number, key: "disks" | "vms", idx: number) {
      return () => {
        return update((value) => {
          value.projects[value.active].resources[resourceIdx][key].splice(idx, 1); // prettier-ignore
          return value;
        });
      };
    },

    removeFromVm(
      resourceIdx: number,
      vm_idx: number,
      key: "mounts" | "env_vars",
      idx: number
    ) {
      return () => {
        return update((value) => {
          value.projects[value.active].resources[resourceIdx].vms[vm_idx][key].splice(idx, 1); // prettier-ignore
          return value;
        });
      };
    },

    removeResource(idx: number) {
      return update((value) => {
        value.projects[value.active].resources.splice(idx, 1);
        return value;
      });
    },

    removeProject(idx: number) {
      return update((value) => {
        value.projects.splice(idx, 1);
        value.active = -1;
        return value;
      });
    },

    removeNetwork() {
      return update((value) => {
        value.projects[value.active].network = null;
        return value;
      });
    },

    removeZdb(resourceIdx: number, idx: number) {
      return update((value) => {
        value.projects[value.active].resources[resourceIdx].zdbs.splice(idx, 1);
        return value;
      });
    },

    removeMaster(resourceIdx: number, idx: number) {
      return update((value) => {
        value.projects[value.active].resources[resourceIdx].masters.splice(idx, 1); // prettier-ignore
        return value;
      });
    },

    removeWorker(resourceIdx: number, idx: number) {
      return update((value) => {
        value.projects[value.active].resources[resourceIdx].workers.splice(idx, 1); // prettier-ignore
        return value;
      });
    },
  };
}

export default createCodeStore();
