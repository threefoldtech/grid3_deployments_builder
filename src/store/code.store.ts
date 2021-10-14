import type { Updater } from "svelte/store";
import { writable } from "svelte/store";
import { HTTPMessageBusClient } from "ts-rmb-http-client";
import {
  Project,
  Env,
  Resource,
  Disk,
  VM,
  ZDB,
  Network,
  Master,
  Worker,
} from "../models";

import {
  DeleteMachineModel,
  DeleteWorkerModel,
  DeleteZDBModel,
  K8SDeleteModel,
  MachinesDeleteModel,
  MachineModule,
  K8sModule,
  ZdbsModule,
  ZDBDeleteModel,
} from "grid3_client_ts";

export type Add_Types =
  | "project"
  | "deployment"
  | "disks"
  | "vms"
  | "env_vars"
  | "zdbs"
  | "zdb"
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
        if (type == "vms" || type == "master" || type == "worker" || type == "zdb")
          if (resourceIdx == undefined && value.projects[value.active].resources.length === 1)
            resourceIdx = 0;

        // prettier-ignore
        if (type == "env_vars")
          if (resourceIdx != undefined && idx == undefined && value.projects[value.active].resources[resourceIdx].vms.length === 1)
            idx = 0;

        switch (type) {
          case "project":
            value.active = value.projects.push(new Project()) - 1;
            break;

          case "zdbs":
            value.projects[value.active].resources.push(new Resource(
              "zdbs",
              undefined,
              "zdbs_deployment",
              undefined,
              [new ZDB(), new ZDB()],
              undefined,
              undefined
            )); // prettier-ignore
            break;

          case "zdb":
            if (resourceIdx != undefined)
              if (value.projects[value.active].resources[resourceIdx].type === 'zdbs')
                value.projects[value.active].resources[resourceIdx].zdbs.push(new ZDB()); // prettier-ignore
            break;

          case "master":
            if (resourceIdx != undefined)
              if (value.projects[value.active].resources[resourceIdx].type === 'kubernetes')
                value.projects[value.active].resources[resourceIdx].masters.push(new Master()); // prettier-ignore
            break;

          case "worker":
            if (resourceIdx != undefined)
              if (value.projects[value.active].resources[resourceIdx].type === 'kubernetes')
                value.projects[value.active].resources[resourceIdx].workers.push(new Worker()); // prettier-ignore
            break;

          case "deployment":
            value.projects[value.active].resources.push(new Resource());
            break;

          case "disks":
            if (resourceIdx != undefined && idx !=undefined)
              value.projects[value.active].resources[resourceIdx].vms[idx].disks.push(new Disk()); // prettier-ignore
            break;

          case "vms":
            if (resourceIdx != undefined)
              if (value.projects[value.active].resources[resourceIdx].type !== 'kubernetes')
                value.projects[value.active].resources[resourceIdx].vms.push(new VM()); // prettier-ignore
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
                "kubernetes",
                undefined,
                "kubernetes_deployment",
                undefined,
                undefined,
                [new Master()],
                [new Worker()]
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
      vmIdx: number,
      index: number,
      key: R
    ) {
      return (e: any) => {
        return update((value) => {
          const { type, value: val } = e.target;
          value.projects[value.active].resources[resourceIdx].vms[vmIdx].disks[index][key] = type === "number" ? +val : val; // prettier-ignore
          return value;
        });
      };
    },

    updateVm<R extends keyof VM>(resourceIdx: number, index: number, key: R) {
      return (e: any) => {
        return update((value) => {
          if (key === "publicIp") {
            const val = value.projects[value.active].resources[resourceIdx].vms[index].publicIp; // prettier-ignore
            value.projects[value.active].resources[resourceIdx].vms[index].publicIp = !val; // prettier-ignore
          } else if (key === "planetary") {
            const val = value.projects[value.active].resources[resourceIdx].vms[index].planetary; // prettier-ignore
            value.projects[value.active].resources[resourceIdx].vms[index].planetary = !val; // prettier-ignore
          } else {
            const { type, value: val } = e.target;
            value.projects[value.active].resources[resourceIdx].vms[index][key] = type === "number" ? +val : val; // prettier-ignore
          }
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
          if (key === "publicIp") {
            const val = value.projects[value.active].resources[resourceIdx].zdbs[index].publicIp; // prettier-ignore
            value.projects[value.active].resources[resourceIdx].zdbs[index].publicIp = !val; // prettier-ignore
          } else if (key === "diskType" || key === "mode") {
            value.projects[value.active].resources[resourceIdx].zdbs[index][
              key
            ] = e.target.options[e.target.options.selectedIndex].value;
          } else {
            const { type, value: val } = e.target;
            value.projects[value.active].resources[resourceIdx].zdbs[index][key] = type === "number" ? +val : val; // prettier-ignore
          }

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
          if (key === "publicIp") {
            const val = value.projects[value.active].resources[resourceIdx].masters[index].publicIp; // prettier-ignore
            value.projects[value.active].resources[resourceIdx].masters[index].publicIp = !val; // prettier-ignore
          } else if (key === "planetary") {
            const val = value.projects[value.active].resources[resourceIdx].vms[index].planetary; // prettier-ignore
            value.projects[value.active].resources[resourceIdx].vms[index].planetary = !val; // prettier-ignore
          } else {
            const { type, value: val } = e.target;
            value.projects[value.active].resources[resourceIdx].masters[index][key] = type === "number" ? +val : val; // prettier-ignore
          }
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
          if (key === "publicIp") {
            const val = value.projects[value.active].resources[resourceIdx].workers[index].publicIp; // prettier-ignore
            value.projects[value.active].resources[resourceIdx].workers[index].publicIp = !val; // prettier-ignore
          } else if (key === "planetary") {
            const val = value.projects[value.active].resources[resourceIdx].vms[index].planetary; // prettier-ignore
            value.projects[value.active].resources[resourceIdx].vms[index].planetary = !val; // prettier-ignore
          } else {
            const { type, value: val } = e.target;
            value.projects[value.active].resources[resourceIdx].workers[index][key] = type === "number" ? +val : val; // prettier-ignore
          }
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

    updateDeploy(resourceIdx: number, val: boolean = true) {
      return update((value) => {
        value.projects[value.active].resources[resourceIdx].isDeployed = val;
        switch (value.projects[value.active].resources[resourceIdx].type) {
          case "deployment":
            value.projects[value.active].resources[resourceIdx].vms.forEach(
              (vm) => {
                vm.isDeployed = true;
                vm.disks.forEach((d) => {
                  d.isDeployed = true;
                });
                vm.env_vars.forEach((env) => {
                  env.isDeployed = true;
                });
              }
            );
            break;
          case "kubernetes":
            value.projects[value.active].resources[resourceIdx].masters.forEach(
              (m) => {
                m.isDeployed = true;
              }
            );
            value.projects[value.active].resources[resourceIdx].workers.forEach(
              (w) => {
                w.isDeployed = true;
              }
            );
            break;
          case "zdbs":
            value.projects[value.active].resources[resourceIdx].zdbs.forEach(
              (z) => {
                z.isDeployed = true;
              }
            );
            break;
        }
        return value;
      });
    },

    removeFromResource(resourceIdx: number, key: "vms", idx: number) {
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
      key: "disks" | "env_vars",
      idx: number
    ) {
      return () => {
        return update((value) => {
          value.projects[value.active].resources[resourceIdx].vms[vm_idx][key].splice(idx, 1); // prettier-ignore
          return value;
        });
      };
    },

    removeResource(idx: number, mnemStore) {
      return update((value) => {
        const rmb = new HTTPMessageBusClient(
          mnemStore.twinId,
          mnemStore.proxyUrl
        );
        if (value.projects[value.active].resources[idx].isDeployed) {
          let result;
          switch (value.projects[value.active].resources[idx].type) {
            case "deployment":
              const machineDeployer = new MachineModule(
                mnemStore.twinId,
                mnemStore.explorerUrl,
                mnemStore.mnemonics,
                rmb
              );
              machineDeployer.fileName = value.projects[value.active].name +"/" +machineDeployer.fileName; //prettier-ignore
              const deleteMachines = new MachinesDeleteModel();
              deleteMachines.name =
                value.projects[value.active].resources[idx].name;
              result = machineDeployer.delete(deleteMachines);
              console.log(result);
              break;
            case "kubernetes":
              const kubeDeployer = new K8sModule(
                mnemStore.twinId,
                mnemStore.explorerUrl,
                mnemStore.mnemonics,
                rmb
              );
              kubeDeployer.fileName = value.projects[value.active].name + "/" + kubeDeployer.fileName; //prettier-ignore
              const deleteKube = new K8SDeleteModel();
              deleteKube.name =
                value.projects[value.active].resources[idx].name;
              result = kubeDeployer.delete(deleteKube);
              console.log(result);
              break;
            case "zdbs":
              const zdbDeployer = new ZdbsModule(
                mnemStore.twinId,
                mnemStore.explorerUrl,
                mnemStore.mnemonics,
                rmb
              );
              zdbDeployer.fileName = value.projects[value.active].name + "/" + zdbDeployer.fileName;
              const deleteZdb = new ZDBDeleteModel();
              deleteZdb.name = value.projects[value.active].resources[idx].name;
              result = zdbDeployer.delete(deleteZdb);
              console.log(result);
              break;
          }
          result.then((res) => {
            if (res.deleted.length) {
              value.projects[value.active].resources.splice(idx, 1);
            }
          });
        } else {
          value.projects[value.active].resources.splice(idx, 1);
        }
        return value;
      });
    },

    removeProject(idx: number, mnemStore) {
      return update((value) => {
        value.projects.splice(idx, 1);
        value.active = -1;
        return value;
      });
    },

    renameProject(idx: number) {
      return (e: any) => {
        return update((value) => {
          const { type, value: val } = e.target;
          value.projects[idx].name = val;
          return value;
        });
      };
    },

    removeNetwork() {
      return update((value) => {
        value.projects[value.active].network = null;
        return value;
      });
    },

    removeZdb(resourceIdx: number, idx: number, mnemStore) {
      return update((value) => {
        if (value.projects[value.active].resources[resourceIdx].zdbs[idx].isDeployed) {
          const rmb = new HTTPMessageBusClient(
            mnemStore.twinId,
            mnemStore.proxyUrl
          );
          const zdbDeployer = new ZdbsModule(
            mnemStore.twinId,
            mnemStore.explorerUrl,
            mnemStore.mnemonics,
            rmb
          );
          zdbDeployer.fileName = value.projects[value.active].name + "/" + zdbDeployer.fileName; //prettier-ignore
          const deleteZdbPayload = new DeleteZDBModel();
          deleteZdbPayload.deployment_name = value.projects[value.active].resources[resourceIdx].name;
          deleteZdbPayload.name = value.projects[value.active].resources[resourceIdx].zdbs[idx].name;
          zdbDeployer.deleteZdb(deleteZdbPayload).then((res) => {
            if (res.deleted.length || res.updated.length) {
              value.projects[value.active].resources[resourceIdx].zdbs.splice(idx,1); //prettier-ignore
            }
          });
        }else{
          value.projects[value.active].resources[resourceIdx].zdbs.splice(idx,1); //prettier-ignore
        }
        return value;
      });
    },

    removeMaster(resourceIdx: number, idx: number) {
      return update((value) => {
        value.projects[value.active].resources[resourceIdx].masters.splice(idx, 1); // prettier-ignore
        return value;
      });
    },

    removeWorker(resourceIdx: number, idx: number, mnemStore) {
      return update((value) => {
        if (value.projects[value.active].resources[resourceIdx].workers[idx].isDeployed) {
          const rmb = new HTTPMessageBusClient(
            mnemStore.twinId,
            mnemStore.proxyUrl
          );
          console.log(rmb.twinId)
          const kubeDeployer = new K8sModule(
            mnemStore.twinId,
            mnemStore.explorerUrl,
            mnemStore.mnemonics,
            rmb
          );
          kubeDeployer.fileName = value.projects[value.active].name + "/" + kubeDeployer.fileName; //prettier-ignore
          const deleteWorkerModel = new DeleteWorkerModel();
          deleteWorkerModel.deployment_name = value.projects[value.active].resources[resourceIdx].name;
          deleteWorkerModel.name = value.projects[value.active].resources[resourceIdx].workers[idx].name;
          kubeDeployer.deleteWorker(deleteWorkerModel).then((res) => {
            if (res.deleted.length || res.updated.length) {
              value.projects[value.active].resources[resourceIdx].workers.splice(idx,1); //prettier-ignore
            }
          });
        }else{
          value.projects[value.active].resources[resourceIdx].workers.splice(idx, 1); // prettier-ignore
        }
        return value;
      });
    },

    removeVM(resourceIdx: number, idx: number, mnemStore) {
      return update((value) => {
        if (value.projects[value.active].resources[resourceIdx].vms[idx].isDeployed) {
          const rmb = new HTTPMessageBusClient(
            mnemStore.twinId,
            mnemStore.proxyUrl
          );
          const vmDeployer = new MachineModule(
            mnemStore.twinId,
            mnemStore.explorerUrl,
            mnemStore.mnemonics,
            rmb
          );
          vmDeployer.fileName = value.projects[value.active].name +"/" +vmDeployer.fileName; //prettier-ignore
          const deleteVM = new DeleteMachineModel();
          deleteVM.deployment_name = value.projects[value.active].resources[resourceIdx].name;
          deleteVM.name = value.projects[value.active].resources[resourceIdx].vms[idx].name;
          vmDeployer.deleteMachine(deleteVM).then((res) => {
            if (res.deleted.length || res.updated.length) {
              value.projects[value.active].resources[resourceIdx].vms.splice(idx,1); //prettier-ignore
            }
          });
        }else{
          value.projects[value.active].resources[resourceIdx].vms.splice(idx, 1); // prettier-ignore
        }
        return value;
      });
    },
  };
}

export default createCodeStore();
