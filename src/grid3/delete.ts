import codeStore from "../store/code.store";
import {
  addSuccessToast,
  addInfoToast,
  addErrorToast,
} from "../store/toast.store";
import type { GridClient } from "grid3_client";
import { Machine, Resource, Worker, ZDB } from "src/models";
import { getClient } from "./get";

export async function deleteResource(
  mnemStore,
  projectName: string,
  resource: Resource,
  resourceIdx: number
) {
  if (resource.isDeployed) {
    const gridClient = await getClient(mnemStore, projectName);
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
        await deleteDomain(gridClient, resource.name, resourceIdx);
        break;
      case "name":
        await deletePrefixDomain(gridClient, resource.name, resourceIdx);
        break;
      case "qsfsZdbs":
        await deleteQsfsZdbs(gridClient, resource.name, resourceIdx);
        break;
    }
    gridClient.disconnect();
  } else {
    codeStore.removeResource(resourceIdx);
  }
}

async function deleteMachines(
  gridClient: GridClient,
  deploymentName: string,
  resourceIdx: number
) {
  const result = await gridClient.machines.delete({ name: deploymentName });
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
  const result = await gridClient.k8s.delete({ name: deploymentName });
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
  let result = await gridClient.zdbs.delete({ name: deploymentName });
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
  let result = await gridClient.qsfs_zdbs.delete({ name: deploymentName });
  if (result.deleted.length || result.updated.length) {
    addSuccessToast(`${deploymentName} deleted successfully`);
    codeStore.removeResource(resourceIdx);
  } else {
    addErrorToast(`Error happen while deleting ${deploymentName}`);
  }
}

async function deleteDomain(
  gridClient: GridClient,
  deploymentName: string,
  resourceIdx: number
) {
  const result = await gridClient.gateway.delete_fqdn({ name: deploymentName });
  if (result.deleted.length || result.updated.length) {
    addSuccessToast(`${deploymentName} deleted successfully`);
    codeStore.removeResource(resourceIdx);
  } else {
    addErrorToast(`Error happen while deleting ${deploymentName}`);
  }
}

async function deletePrefixDomain(
  gridClient: GridClient,
  deploymentName: string,
  resourceIdx: number
) {
  const result = await gridClient.gateway.delete_name({ name: deploymentName });
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
    const result = await gridClient.machines.delete_machine({
      deployment_name: deploymentName,
      name: machine.name,
    });
    if (result.deleted.length || result.updated.length) {
      addSuccessToast(`${machine.name} deleted successfully`);
      codeStore.removeVM(deploymentId, machineId);
    } else {
      addErrorToast(`Error happen while deleting ${machine.name}`);
    }
    gridClient.disconnect();
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
    const result = await gridClient.k8s.delete_worker({
      deployment_name: deploymentName,
      name: worker.name,
    });
    if (result.deleted.length || result.updated.length) {
      addSuccessToast(`${worker.name} deleted successfully`);
      codeStore.removeWorker(deploymentId, workerId);
    } else {
      addErrorToast(`Error happen while deleting ${worker.name}`);
    }
    gridClient.disconnect();
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
    const result = await gridClient.zdbs.delete_zdb({
      deployment_name: deploymentName,
      name: zdb.name,
    });
    if (result.deleted.length || result.updated.length) {
      addSuccessToast(`${zdb.name} deleted successfully`);
      codeStore.removeZdb(deploymentId, zdbId);
    } else {
      addErrorToast(`Error happen while deleting ${zdb.name}`);
    }
    gridClient.disconnect();
  } else {
    codeStore.removeZdb(deploymentId, zdbId);
  }
}
