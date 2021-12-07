import type { Updater } from "svelte/store";
import { writable } from "svelte/store";
import { addErrorNotification } from "./notification.store";
import {
  Project,
  Resource,
  Machines,
  Machine,
  Disk,
  QsfsDisk,
  Env,
  ZDBs,
  ZDB,
  QsfsZDBs,
  Network,
  Kubernetes,
  Master,
  Worker,
  GatewayFQDN,
  GatewayName,
} from "../models";

export type Add_Types =
  | "project"
  | "machines"
  | "disk"
  | "qsfsDisk"
  | "machine"
  | "envVar"
  | "zdbs"
  | "zdb"
  | "qsfsZdbs"
  | "master"
  | "worker"
  | "network"
  | "kubernetes"
  | "gatewayFQDN"
  | "gatewayName";

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
        if (type == "machine" || type == "master" || type == "worker" || type == "zdb")
          if (resourceIdx == undefined && value.projects[value.active].resources.length === 1)
            resourceIdx = 0;

        switch (type) {
          case "project":
            value.active =
              value.projects.push(
                new Project(undefined, undefined, undefined, undefined, true)
              ) - 1;
            break;

          case "zdbs":
            value.projects[value.active].resources.push(new ZDBs(undefined,undefined, undefined, [new ZDB()])); // prettier-ignore
            break;

          case "zdb":
            if (resourceIdx != undefined)
              if (value.projects[value.active].resources[resourceIdx].type === 'zdbs')
                (value.projects[value.active].resources[resourceIdx] as ZDBs).zdbs.push(new ZDB()); // prettier-ignore
              else
                addErrorNotification(`Can't add new zdb to ${value.projects[value.active].resources[resourceIdx].type} type`)
            break;

          case "kubernetes":
            value.projects[value.active].resources.push(
              new Kubernetes(
                undefined,
                undefined,
                undefined,
                [new Master(), new Worker()]
              )
            );
            break;
          case "master":
            // Master added by default no need to do anything
            break;

          case "worker":
            if (resourceIdx != undefined)
              if (value.projects[value.active].resources[resourceIdx].type === 'kubernetes')
                (value.projects[value.active].resources[resourceIdx] as Kubernetes).kubeNodes.push(new Worker()); // prettier-ignore
              else
                addErrorNotification(`Can't add worker to ${value.projects[value.active].resources[resourceIdx].type} type`); //prettier-ignore
            break;

          case "machines":
            value.projects[value.active].resources.push(new Machines());
            break;

          case "machine":
            if (resourceIdx != undefined)
              if (value.projects[value.active].resources[resourceIdx].type === 'machines')
                (value.projects[value.active].resources[resourceIdx] as Machines).machines.push(new Machine()); // prettier-ignore
              else
                addErrorNotification(`Can't add machine to ${value.projects[value.active].resources[resourceIdx].type} type`);
            break;

          case "disk":
            if (
              resourceIdx != undefined &&
              idx != undefined &&
              value.projects[value.active].resources[resourceIdx].type ===
                "machines"
            ) {
              if (
                !(
                  value.projects[value.active].resources[
                    resourceIdx
                  ] as Machines
                ).machines[idx].isDeployed
              ) {
                (value.projects[value.active].resources[resourceIdx] as Machines).machines[idx].disks.push(new Disk()); // prettier-ignore
              } else {
                addErrorNotification(`Can't add new disk to deployed machine`);
              }
            } else {
              addErrorNotification(
                `Can't add disk to ${value.projects[value.active].resources[resourceIdx].type} type`
              );
            }
            break;

          case "qsfsDisk":
            if (resourceIdx != undefined && idx != undefined) {
              switch(value.projects[value.active].resources[resourceIdx].type){
                case "machines":
                  if (!((value.projects[value.active].resources[resourceIdx] as Machines).machines[idx].isDeployed)){
                    (value.projects[value.active].resources[resourceIdx] as Machines).machines[idx].qsfsDisks.push(new QsfsDisk()); // prettier-ignore
                  }else{
                    addErrorNotification(`Can't add new QSFS disk to deployed machine`);
                  }
                  break;
                case "kubernetes":
                  console.log("Resource Id:: ",resourceIdx, "Worker id:: ",idx)
                  if (!((value.projects[value.active].resources[resourceIdx] as Kubernetes).kubeNodes[idx].isDeployed)){
                    (value.projects[value.active].resources[resourceIdx] as Kubernetes).kubeNodes[idx].qsfsDisks.push(new QsfsDisk()); // prettier-ignore
                  }else{
                    addErrorNotification(`Can't add new QSFS disk to deployed worker`);
                  }
                  break;
                default:
                  addErrorNotification(`Can't add QSFSs disk to ${value.projects[value.active].resources[resourceIdx].type} type`); // prettier-ignore
                  break;
              }
            }
            break;

          case "envVar":
            if (
              resourceIdx != undefined &&
              idx != undefined &&
              value.projects[value.active].resources[resourceIdx].type ===
                "machines"
            ) {
              if (
                !(
                  value.projects[value.active].resources[
                    resourceIdx
                  ] as Machines
                ).machines[idx].isDeployed
              ) {
                (value.projects[value.active].resources[resourceIdx] as Machines).machines[idx].env_vars.push(new Env()); // prettier-ignore
              } else {
                addErrorNotification(
                  `Can't add new environment variable to deployed machine`
                );
              }
            } else {
              addErrorNotification(
                `Can't add environment variable to ${value.projects[value.active].resources[resourceIdx].type} type`
              );
            }
            break;

          case "network":
            value.projects[value.active].network = new Network();
            break;

          case "gatewayFQDN":
            value.projects[value.active].resources.push(new GatewayFQDN());
            break;

          case "gatewayName":
            value.projects[value.active].resources.push(new GatewayName());
            break;

          case "qsfsZdbs":
            value.projects[value.active].resources.unshift(new QsfsZDBs());
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

    updateKubernetes<R extends keyof Kubernetes>(key: R, idx: number) {
      return (e: any) => {
        return update((value) => {
          const { type, value: val } = e.target;
          (value.projects[value.active].resources[idx] as Kubernetes)[key] = type === "number" ? +val : val; // prettier-ignore
          return value;
        });
      };
    },

    updateKubeNode<R extends keyof Worker>(
      resourceIdx: number,
      index: number,
      key: R
    ) {
      return (e: any) => {
        return update((value) => {
          if (key === "publicIp") {
            const val = (value.projects[value.active].resources[resourceIdx] as Kubernetes).kubeNodes[index].publicIp; // prettier-ignore
            (value.projects[value.active].resources[resourceIdx] as Kubernetes).kubeNodes[index].publicIp = !val; // prettier-ignore
          } else if (key === "planetary") {
            const val = (value.projects[value.active].resources[resourceIdx] as Kubernetes).kubeNodes[index].planetary; // prettier-ignore
            (value.projects[value.active].resources[resourceIdx] as Kubernetes).kubeNodes[index].planetary = !val; // prettier-ignore
          } else {
            const { type, value: val } = e.target;
            (value.projects[value.active].resources[resourceIdx] as Kubernetes).kubeNodes[index][key] = type === "number" ? +val : val; // prettier-ignore
          }
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
          (value.projects[value.active].resources[resourceIdx] as Machines).machines[vmIdx].disks[index][key] = type === "number" ? +val : val; // prettier-ignore
          return value;
        });
      };
    },

    updateQsfsDisk<R extends keyof QsfsDisk>(
      resourceIdx: number,
      elementIdx: number,
      index: number,
      key: R
    ) {
      return (e: any) => {
        return update((value) => {
          const { type, value: val } = e.target;
          switch(value.projects[value.active].resources[resourceIdx].type){
            case "machines":
              if (key === "minimalShards") {
                (
                  value.projects[value.active].resources[resourceIdx] as Machines
                ).machines[elementIdx].qsfsDisks[index].minimalShards = +val;
                if((value.projects[value.active].resources[resourceIdx] as Machines).machines[elementIdx].qsfsDisks[index].expectedShards <= +val){
                  (value.projects[value.active].resources[resourceIdx] as Machines).machines[elementIdx].qsfsDisks[index].expectedShards = +val + 1;
                } // prettier-ignore
              }else{
                (value.projects[value.active].resources[resourceIdx] as Machines).machines[elementIdx].qsfsDisks[index][key] = type === "number" ? +val : val; // prettier-ignore
              }
              break;
            case "kubernetes":
              if (key === "minimalShards") {
                (
                  value.projects[value.active].resources[resourceIdx] as Kubernetes
                ).kubeNodes[elementIdx].qsfsDisks[index].minimalShards = +val;
                if((value.projects[value.active].resources[resourceIdx] as Kubernetes).kubeNodes[elementIdx].qsfsDisks[index].expectedShards <= +val){
                  (value.projects[value.active].resources[resourceIdx] as Kubernetes).kubeNodes[elementIdx].qsfsDisks[index].expectedShards = +val + 1;
                } // prettier-ignore
              }else{
                (value.projects[value.active].resources[resourceIdx] as Kubernetes).kubeNodes[elementIdx].qsfsDisks[index][key] = type === "number" ? +val : val; // prettier-ignore
              }
              break;
          }
          return value;
        });
      };
    },

    updateVm<R extends keyof Machine>(
      resourceIdx: number,
      index: number,
      key: R
    ) {
      return (e: any) => {
        return update((value) => {
          if (key === "publicIp") {
            const val = (value.projects[value.active].resources[resourceIdx] as Machines).machines[index].publicIp; // prettier-ignore
            (value.projects[value.active].resources[resourceIdx] as Machines).machines[index].publicIp = !val; // prettier-ignore
          } else if (key === "planetary") {
            const val = (value.projects[value.active].resources[resourceIdx] as Machines).machines[index].planetary; // prettier-ignore
            (value.projects[value.active].resources[resourceIdx] as Machines).machines[index].planetary = !val; // prettier-ignore
          } else {
            const { type, value: val } = e.target;
            (value.projects[value.active].resources[resourceIdx] as Machines).machines[index][key] = type === "number" ? +val : val; // prettier-ignore
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
          (value.projects[value.active].resources[resourceIdx] as Machines).machines[vm_index].env_vars[index][key] = type === "number" ? +val : val; // prettier-ignore
          return value;
        });
      };
    },

    updateZdb<R extends keyof ZDB>(resourceIdx: number, index: number, key: R) {
      return (e: any) => {
        return update((value) => {
          if (key === "publicIp") {
            const val = (value.projects[value.active].resources[resourceIdx]as ZDBs).zdbs[index].publicIp; // prettier-ignore
            (value.projects[value.active].resources[resourceIdx]as ZDBs).zdbs[index].publicIp = !val; // prettier-ignore
          } else if (key === "mode") {
            (value.projects[value.active].resources[resourceIdx]as ZDBs).zdbs[index][key] = e.target.options[e.target.options.selectedIndex].value; //prettier-ignore
          } else {
            const { type, value: val } = e.target;
            (value.projects[value.active].resources[resourceIdx]as ZDBs).zdbs[index][key] = type === "number" ? +val : val; // prettier-ignore
          }

          return value;
        });
      };
    },

    updateQsfsZdbs<R extends keyof QsfsZDBs>(key: R, idx: number) {
      return (e: any) => {
        return update((value) => {
          const { type, value: val } = e.target;
          if (key === "nodeIds") {
            (value.projects[value.active].resources[idx] as QsfsZDBs).nodeIds =
              val
                .split(",")
                .map((v) => v.trim())
                .map((v) => +v)
                .filter((v) => !isNaN(v));
          } else {
            (value.projects[value.active].resources[idx]as QsfsZDBs)[key] = type === "number" ? +val : val; // prettier-ignore
          }
          return value;
        });
      };
    },

    updateNetwork<R extends keyof Network>(key: R) {
      return (e: any) => {
        return update((value) => {
          const { type, value: val } = e.target;
          value.projects[value.active].network[key] = type === "number" ? +val : val; // prettier-ignore
          return value;
        });
      };
    },

    updateGatewayFQDN<R extends keyof GatewayFQDN>(key: R, idx: number) {
      return (e: any) => {
        return update((value) => {
          const { type, value: val } = e.target;
          if (key === "tlsPassThrough") {
            const val = (value.projects[value.active].resources[idx] as GatewayFQDN).tlsPassThrough; // prettier-ignore
            (value.projects[value.active].resources[idx] as GatewayFQDN).tlsPassThrough = !val; // prettier-ignore
          } else if (key === "backends") {
            (value.projects[value.active].resources[idx] as GatewayFQDN).backends = val.split(",").map((v) => v.trim()); // prettier-ignore
          } else {
            (value.projects[value.active].resources[idx] as GatewayFQDN)[key] = type === "number" ? +val : val; // prettier-ignore
          }
          return value;
        });
      };
    },

    updateGatewayName<R extends keyof GatewayName>(key: R, idx: number) {
      return (e: any) => {
        return update((value) => {
          const { type, value: val } = e.target;
          if (key === "tlsPassThrough") {
            const val = (value.projects[value.active].resources[idx] as GatewayName).tlsPassThrough; // prettier-ignore
            (value.projects[value.active].resources[idx] as GatewayName).tlsPassThrough = !val; // prettier-ignore
          } else if (key === "backends") {
            (
              value.projects[value.active].resources[idx] as GatewayName
            ).backends = val.split(",").map((v) => v.trim());
          } else {
            (value.projects[value.active].resources[idx] as GatewayName)[key] = type === "number" ? +val : val; // prettier-ignore
          }
          return value;
        });
      };
    },

    updateDeployAllElements(resourceIdx: number, val: boolean = true) {
      return update((value) => {
        value.projects[value.active].resources[resourceIdx].isDeployed = val;
        switch (value.projects[value.active].resources[resourceIdx].type) {
          case "machines":
            (
              value.projects[value.active].resources[resourceIdx] as Machines
            ).machines.forEach((vm) => {
              vm.isDeployed = val;
              vm.disks.forEach((d) => {
                d.isDeployed = val;
              });
              vm.qsfsDisks.forEach((qd) => {
                qd.isDeployed = val;
              });
              vm.env_vars.forEach((env) => {
                env.isDeployed = val;
              });
            });
            break;
          case "kubernetes":
            (
              value.projects[value.active].resources[resourceIdx] as Kubernetes
            ).kubeNodes.forEach((kNode) => {
              kNode.isDeployed = val;
              kNode.qsfsDisks.forEach((qd) => {
                qd.isDeployed = val;
              });
            });
            
            break;
          case "zdbs":
            (
              value.projects[value.active].resources[resourceIdx] as ZDBs
            ).zdbs.forEach((z) => {
              z.isDeployed = val;
            });
            break;
          case "qsfsZdbs":
          case "fqdn":
          case "name":
            value.projects[value.active].resources[resourceIdx].isDeployed =
              val;
        }
        return value;
      });
    },

    updateDeployOneElement(
      resourceIdx: number,
      idx: number,
      val: boolean = true
    ) {
      return update((value) => {
        switch (value.projects[value.active].resources[resourceIdx].type) {
          case "machines":
            let vm = (
              value.projects[value.active].resources[resourceIdx] as Machines
            ).machines[idx];
            vm.isDeployed = val;
            vm.disks.forEach((d) => {
              d.isDeployed = val;
            });
            vm.env_vars.forEach((env) => {
              env.isDeployed = val;
            });
            vm.qsfsDisks.forEach((qd) => {
              qd.isDeployed = val;
            });
            (
              value.projects[value.active].resources[resourceIdx] as Machines
            ).machines[idx] = vm;
            break;
          case "kubernetes":
            let kNode = (value.projects[value.active].resources[resourceIdx] as Kubernetes).kubeNodes[idx];
            kNode.isDeployed = val;
            kNode.qsfsDisks.forEach((qd) => {
              qd.isDeployed = val;
            });
            break;
          case "zdbs":
            (value.projects[value.active].resources[resourceIdx] as ZDBs).zdbs[
              idx
            ].isDeployed = val;
            break;
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

    removeResource(idx: number) {
      return update((value) => {
        value.projects[value.active].resources.splice(idx, 1);
        return value;
      });
    },

    removeFromVm(
      resourceIdx: number,
      vm_idx: number,
      key: "disks" | "env_vars" | "qsfsDisks",
      idx: number
    ) {
      return () => {
        return update((value) => {
          (value.projects[value.active].resources[resourceIdx] as Machines).machines[vm_idx][key].splice(idx, 1); // prettier-ignore
          return value;
        });
      };
    },

    removeFromKubeNode(
      resourceIdx: number,
      kNode_idx: number,
      idx: number
    ) {
      return () => {
        return update((value) => {
          (value.projects[value.active].resources[resourceIdx] as Kubernetes).kubeNodes[kNode_idx].qsfsDisks.splice(idx, 1); // prettier-ignore
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

    removeZdb(resourceIdx: number, idx: number) {
      return update((value) => {
        (value.projects[value.active].resources[resourceIdx] as ZDBs).zdbs.splice(idx,1); //prettier-ignore
        return value;
      });
    },

    removeWorker(resourceIdx: number, idx: number) {
      return update((value) => {
        (value.projects[value.active].resources[resourceIdx] as Kubernetes).kubeNodes.splice(idx, 1); // prettier-ignore
        return value;
      });
    },

    removeVM(resourceIdx: number, idx: number) {
      return update((value) => {
        (value.projects[value.active].resources[resourceIdx] as Machines).machines.splice(idx, 1); // prettier-ignore
        return value;
      });
    },
  };
}

export default createCodeStore();
