import type { Updater } from "svelte/store";
import { writable } from "svelte/store";
import { v4 } from "uuid";

export type Add_Types = "resource" | "disks" | "vms" | "mounts" | "env_vars";

export class Disk {
  constructor(
    public id: string = v4(),
    public name: string = "mydisk",
    public size: number = 2,
    public description: string = "this is my disk description"
  ) {}
}

export class VM {
  constructor(
    public id: string = v4(),
    public name: string = "vm",
    public flist: string = "https://hub.grid.tf/tf-official-apps/base:latest.flist",
    public cpu: number = 1,
    public memory: number = 1024,
    public entrypoint: string = "/sbin/zinit init",
    public mounts: Mount[] = [],
    public env_vars: Env[] = []
  ) {}
}

export class Mount {
  constructor(
    public id: string = v4(),
    public disk_name: string = "mydisk1",
    public mount_point: string = "/opt"
  ) {}
}

export class Env {
  constructor(
    public id: string = v4(),
    public key: string = "SSH_KEY",
    public value: string = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDTwULSsUubOq3VPWL6cdrDvexDmjfznGydFPyaNcn7gAL9lRxwFbCDPMj7MbhNSpxxHV2+/iJPQOTVJu4oc1N7bPP3gBCnF51rPrhTpGCt5pBbTzeyNweanhedkKDsCO2mIEh/92Od5Hg512dX4j7Zw6ipRWYSaepapfyoRnNSriW/s3DH/uewezVtL5EuypMdfNngV/u2KZYWoeiwhrY/yEUykQVUwDysW/xUJNP5o+KSTAvNSJatr3FbuCFuCjBSvageOLHePTeUwu6qjqe+Xs4piF1ByO/6cOJ8bt5Vcx0bAtI8/MPApplUU/JWevsPNApvnA/ntffI+u8DCwgP"
  ) {}
}

export class Resource {
  constructor(
    public title: string = "d1",
    public name: string = "grid_deployment",
    public node: number = 2,
    public disks: Disk[] = [],
    public vms: VM[] = []
  ) {}
}

function createCodeStore() {
  // TODO: load localstorage
  const store = writable<Resource | null>(null);
  const { subscribe, set } = store;

  function update(updater: Updater<Resource>): void {
    store.update((value) => {
      const newValue = updater(value);

      // TODO: add storing to localstorage here
      console.log(value, newValue);

      return newValue;
    });
  }

  return {
    subscribe,
    set,
    add(type: Add_Types, idx?: number) {
      return update((resource) => {
        if (type === "resource") {
          resource = new Resource();
        }

        if (type === "disks") {
          resource.disks.push(new Disk());
        }

        if (type === "vms") {
          resource.vms.push(new VM());
        }

        if (idx === undefined && resource.vms.length === 1) {
          idx = 0;
        }

        if (idx !== undefined) {
          if (type === "mounts") {
            resource.vms[idx].mounts.push(new Mount());
          }

          if (type === "env_vars") {
            resource.vms[idx].env_vars.push(new Env());
          }
        }

        return resource;
      });
    },

    updateResource<R extends keyof Resource>(key: R) {
      return (e: any) => {
        return update((resource) => {
          const { type, value } = e.target;

          resource[key] = type === "number" ? +value : value;
          return resource;
        });
      };
    },

    updateDisk<R extends keyof Disk>(index: number, key: R) {
      return (e: any) => {
        return update((resource) => {
          const { type, value } = e.target;

          resource.disks[index][key] = type === "number" ? +value : value;
          return resource;
        });
      };
    },

    updateVm<R extends keyof VM>(index: number, key: R) {
      return (e: any) => {
        return update((resource) => {
          const { type, value } = e.target;

          resource.vms[index][key] = type === "number" ? +value : value;
          return resource;
        });
      };
    },

    updateMounts<R extends keyof Mount>(
      vm_index: number,
      index: number,
      key: R
    ) {
      return (e: any) => {
        return update((resource) => {
          const { type, value } = e.target;

          resource.vms[vm_index].mounts[index][key] =
            type === "number" ? +value : value;
          return resource;
        });
      };
    },

    updateEnv<R extends keyof Env>(vm_index: number, index: number, key: R) {
      return (e: any) => {
        return update((resource) => {
          const { type, value } = e.target;

          resource.vms[vm_index].env_vars[index][key] =
            type === "number" ? +value : value;
          return resource;
        });
      };
    },

    removeFromResource(key: "disks" | "vms", idx: number) {
      return () => {
        return update((resource) => {
          resource[key].splice(idx, 1);
          return resource;
        });
      };
    },

    removeFromVm(vm_idx: number, key: "mounts" | "env_vars", idx: number) {
      return () => {
        return update((resource) => {
          resource.vms[vm_idx][key].splice(idx, 1);
          return resource;
        });
      };
    },
  };
}

export default createCodeStore();
