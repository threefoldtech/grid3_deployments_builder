import codeStore from "../store/code.store";
import {
  addSuccessToast,
  addInfoToast,
  addErrorToast,
} from "../store/toast.store";
import {
  GridClient,
  MachinesDeleteModel,
  K8SDeleteModel,
  ZDBDeleteModel,
  DeleteZDBModel,
  DeleteWorkerModel,
  DeleteMachineModel,
  QSFSZDBDeleteModel,
} from "grid3_client";
import { Machine, Resource, Worker, ZDB } from "src/models";
import { getClient } from ".";

function checkResult(result, deploymentName): boolean {
  if (result.deleted.length || result.updated.length) {
    addSuccessToast(`${deploymentName} deleted successfully`);
    return true;
  } else {
    addErrorToast(`Error happen while deleting ${deploymentName}`);
    return false;
  }
}

export async function deleteResource(
  mnemStore,
  projectName: string,
  resource: Resource,
  resourceIdx: number
) {
  const gridClient = await getClient(mnemStore, projectName);
  if (resource.isDeployed) {
    switch (resource.type) {
      case "machines":
        await deleteMachines(gridClient, resource.name, resourceIdx);
        break;
      case "kubernetes":
        await deleteKubernetes(gridClient, resource.name, resourceIdx);
        break;
      case "zdbs":
        await deleteZdbs(gridClient, resource.name, resourceIdx);
        break;
      case "fqdn":
        break;
      case "name":
        break;
      case "qsfsZdbs":
        await deleteQsfsZdbs(gridClient, resource.name, resourceIdx)
        break;
    }
  } else {
    codeStore.removeResource(resourceIdx);
  }
}

async function deleteMachines(
  gridClient: GridClient,
  deploymentName: string,
  resourceIdx: number
) {
  const deleteMachines = new MachinesDeleteModel();
  deleteMachines.name = deploymentName;
  console.log(deleteMachines);
  const result = await gridClient.machines.delete(deleteMachines);
  if (result.deleted.length || result.updated.length) {
    addSuccessToast(`${deploymentName} deleted successfully`);
    codeStore.removeResource(resourceIdx);
  } else {
    addErrorToast(`Error happen while deleting ${deploymentName}`);
  }
}

async function deleteKubernetes(
  gridClient: GridClient,
  deploymentName: string,
  resourceIdx: number
) {
  const deleteKube = new K8SDeleteModel();
  deleteKube.name = deploymentName;
  const result = await gridClient.k8s.delete(deleteKube);
  if (result.deleted.length || result.updated.length) {
    addSuccessToast(`${deploymentName} deleted successfully`);
    codeStore.removeResource(resourceIdx);
  } else {
    addErrorToast(`Error happen while deleting ${deploymentName}`);
  }
}

async function deleteZdbs(
  gridClient: GridClient,
  deploymentName: string,
  resourceIdx: number
) {
  const deleteZdbs = new ZDBDeleteModel();
  deleteZdbs.name = deploymentName;
  let result = await gridClient.zdbs.delete(deleteZdbs);
  if (result.deleted.length || result.updated.length) {
    addSuccessToast(`${deploymentName} deleted successfully`);
    codeStore.removeResource(resourceIdx);
  } else {
    addErrorToast(`Error happen while deleting ${deploymentName}`);
  }
}

async function deleteQsfsZdbs(
  gridClient: GridClient,
  deploymentName: string,
  resourceIdx: number
) {
  const deleteQsfsZdbs = new QSFSZDBDeleteModel();
  deleteQsfsZdbs.name = deploymentName;
  let result = await gridClient.qsfs_zdbs.delete(deleteQsfsZdbs);
  if (result.deleted.length || result.updated.length) {
    addSuccessToast(`${deploymentName} deleted successfully`);
    codeStore.removeResource(resourceIdx);
  } else {
    addErrorToast(`Error happen while deleting ${deploymentName}`);
  }
}

export async function deleteMachine(
  mnemStore,
  projectName: string,
  deploymentName: string,
  deploymentId: number,
  machine: Machine,
  machineId: number
) {
  if (machine.isDeployed) {
    const gridClient = await getClient(mnemStore, projectName);
    const deleteVM = new DeleteMachineModel();
    deleteVM.deployment_name = deploymentName;
    deleteVM.name = machine.name;
    const result = await gridClient.machines.delete_machine(deleteVM);
    if (result.deleted.length || result.updated.length) {
      addSuccessToast(`${machine.name} deleted successfully`);
      codeStore.removeVM(deploymentId, machineId);
    } else {
      addErrorToast(`Error happen while deleting ${machine.name}`);
    }
  } else {
    codeStore.removeVM(deploymentId, machineId);
  }
}

export async function deleteWorker(
  mnemStore,
  projectName: string,
  deploymentName: string,
  deploymentId: number,
  worker: Worker,
  workerId: number
) {
  if (worker.isDeployed) {
    const gridClient = await getClient(mnemStore, projectName);
    const deleteWorkerModel = new DeleteWorkerModel();
    deleteWorkerModel.deployment_name = deploymentName;
    deleteWorkerModel.name = worker.name;
    const result = await gridClient.k8s.delete_worker(deleteWorkerModel);
    if (result.deleted.length || result.updated.length) {
      addSuccessToast(`${worker.name} deleted successfully`);
      codeStore.removeWorker(deploymentId, workerId);
    } else {
      addErrorToast(`Error happen while deleting ${worker.name}`);
    }
  } else {
    codeStore.removeWorker(deploymentId, workerId);
  }
}

export async function deleteZdb(
  mnemStore,
  projectName: string,
  deploymentName: string,
  deploymentId: number,
  zdb: ZDB,
  zdbId: number
) {
  if (zdb.isDeployed) {
    const gridClient = await getClient(mnemStore, projectName);
    const deleteZdbPayload = new DeleteZDBModel();
    deleteZdbPayload.deployment_name = deploymentName;
    deleteZdbPayload.name = zdb.name; //prettier-ignore
    const result = await gridClient.zdbs.delete_zdb(deleteZdbPayload);
    if (result.deleted.length || result.updated.length) {
      addSuccessToast(`${zdb.name} deleted successfully`);
      codeStore.removeZdb(deploymentId, zdbId);
    } else {
      addErrorToast(`Error happen while deleting ${zdb.name}`);
    }
  } else {
    codeStore.removeZdb(deploymentId, zdbId);
  }
}
// Not Implemented in grid3 client

// export async function deleteFqdnGateway(
//   gridClient: GridClient,
//   deploymentName: string,
// ) Promise<boolean> {
//   // const deleteZdb = new ZDBDeleteModel();
//   // deleteZdb.name = deploymentName;
//   // const result = await gridClient..delete(deleteZdb);
//   // return checkResult(result, deploymentName);
// }

// export async function deleteNameGateway(
//   gridClient: GridClient,
//   deploymentName: string,
// ) Promise<boolean> {
//   return false;
// }
