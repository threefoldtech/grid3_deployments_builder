import type { Updater } from "svelte/store";
import { writable } from "svelte/store";

import { Project, Env, Resource, Disk, VM, Mount } from "../models";

export type Add_Types =
  | "project"
  | "resource"
  | "disks"
  | "vms"
  | "mounts"
  | "env_vars";

export interface IStore {
  active: number;
  projects: Project[];
}

function createCodeStore() {
  let initData: IStore;
  // try {
  //   let data = localStorage.getItem("store");
  //   if (data) {
  //     initData = JSON.parse(data);
  //   }
  // } catch {}

  const store = writable<IStore>(
    initData || {
      active: -1,
      projects: [
        new Project(undefined, "Hello World", [
          new Resource(
            undefined,
            undefined,
            undefined,
            undefined,
            [new Disk()],
            [
              new VM(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                [new Mount()],
                [new Env()]
              ),
              new VM(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                [new Mount()],
                [new Env()]
              ),
            ]
          ),
          new Resource(),
        ]),
      ],
    }
  );
  const { subscribe, update, set } = store;

  // function update(updater: Updater<IStore>): void {
  //   store.update((value) => {
  //     const newValue = updater(value);
  //     localStorage.setItem("store", JSON.stringify(newValue));
  //     return newValue;
  //   });
  // }

  return {
    subscribe,
    set,
    setActiveProject(active: number) {
      return update((value) => {
        return { ...value, active };
      });
    },
    addNewResource() {
      // return update((value) => {
      //   value.active = value.resources.push(new Resource()) - 1;
      //   return value;
      // });
    },
    add(type: Add_Types, resourceIdx?: number, idx?: number) {
      return update((value) => {
        console.log({ type, projectIdx: value.active, resourceIdx, idx });
        switch (type) {
          case "project":
            value.projects.push(new Project());
            break;

          case "resource":
            value.projects[value.active].resources.push(new Resource());
            break;

          case "disks":
            if (resourceIdx)
              value.projects[value.active].resources[resourceIdx].disks.push(new Disk()); // prettier-ignore
            break;

          case "vms":
            if (resourceIdx)
              value.projects[value.active].resources[resourceIdx].vms.push(new VM()); // prettier-ignore
            break;

          case "mounts":
            if (resourceIdx && idx)
              value.projects[value.active].resources[resourceIdx].vms[idx].mounts.push(new Mount()); // prettier-ignore

          case "env_vars":
            if (resourceIdx && idx)
              value.projects[value.active].resources[resourceIdx].vms[idx].env_vars.push(new Env()); // prettier-ignore
        }
        return value;
      });

      // return update((value) => {
      //   let resource = value.resources[value.active];
      //   if (type === "resource") {
      //     value.active = value.resources.push(new Resource()) - 1;
      //     return value;
      //   }
      //   if (type === "disks") {
      //     resource.disks.push(new Disk());
      //   }
      //   if (type === "vms") {
      //     resource.vms.push(new VM());
      //   }
      //   if (idx === undefined && resource.vms.length === 1) {
      //     idx = 0;
      //   }
      //   if (idx !== undefined) {
      //     if (type === "mounts") {
      //       resource.vms[idx].mounts.push(new Mount());
      //     }
      //     if (type === "env_vars") {
      //       resource.vms[idx].env_vars.push(new Env());
      //     }
      //   }
      //   value.resources[value.active] = resource;
      //   return value;
      // });
    },

    updateResource<R extends keyof Resource>(key: R) {
      return (e: any) => {
        // return update((data) => {
        //   let resource = data.resources[data.active];
        //   const { type, value } = e.target;
        //   resource[key] = type === "number" ? +value : value;
        //   return data;
        // });
      };
    },

    updateDisk<R extends keyof Disk>(index: number, key: R) {
      return (e: any) => {
        // return update((data) => {
        //   let resource = data.resources[data.active];
        //   const { type, value } = e.target;
        //   resource.disks[index][key] = type === "number" ? +value : value;
        //   return data;
        // });
      };
    },

    updateVm<R extends keyof VM>(index: number, key: R) {
      return (e: any) => {
        // return update((data) => {
        //   let resource = data.resources[data.active];
        //   const { type, value } = e.target;
        //   resource.vms[index][key] = type === "number" ? +value : value;
        //   return data;
        // });
      };
    },

    updateMounts<R extends keyof Mount>(
      vm_index: number,
      index: number,
      key: R
    ) {
      return (e: any) => {
        // return update((data) => {
        //   let resource = data.resources[data.active];
        //   const { type, value } = e.target;
        //   resource.vms[vm_index].mounts[index][key] =
        //     type === "number" ? +value : value;
        //   return data;
        // });
      };
    },

    updateEnv<R extends keyof Env>(vm_index: number, index: number, key: R) {
      return (e: any) => {
        // return update((data) => {
        //   let resource = data.resources[data.active];
        //   const { type, value } = e.target;
        //   resource.vms[vm_index].env_vars[index][key] =
        //     type === "number" ? +value : value;
        //   return data;
        // });
      };
    },

    removeFromResource(key: "disks" | "vms", idx: number) {
      return () => {
        // return update((data) => {
        //   let resource = data.resources[data.active];
        //   resource[key].splice(idx, 1);
        //   return data;
        // });
      };
    },

    removeFromVm(vm_idx: number, key: "mounts" | "env_vars", idx: number) {
      return () => {
        // return update((data) => {
        //   let resource = data.resources[data.active];
        //   resource.vms[vm_idx][key].splice(idx, 1);
        //   return data;
        // });
      };
    },

    removeResource() {
      // return update((data) => {
      //   data.resources.splice(data.active, 1);
      //   data.active = -1;
      //   return data;
      // });
    },
  };
}

export default createCodeStore();
