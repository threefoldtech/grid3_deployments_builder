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
} from "grid3_client_ts";

function checkResult(result, deploymentName): boolean {
  if (result.deleted.length || result.updated.length) {
    addSuccessToast(`${deploymentName} deleted successfully`);
    return true;
  } else {
    addErrorToast(`Error happen while deleting ${deploymentName}`);
    return false;
  }
}

export async function deleteMachines(
  gridClient: GridClient,
  deploymentName: string
): Promise<boolean> {
  const deleteMachines = new MachinesDeleteModel();
  deleteMachines.name = deploymentName;
  console.log(deleteMachines);
  const result = await gridClient.machines.delete(deleteMachines);
  return checkResult(result, deploymentName);
}

export async function deleteMachine(
  gridClient: GridClient,
  machineName: string,
  deploymentName: string
): Promise<boolean> {
  const deleteVM = new DeleteMachineModel();
  deleteVM.deployment_name = deploymentName;
  deleteVM.name = machineName;
  const result = gridClient.machines.deleteMachine(deleteVM);
  return checkResult(result, machineName);
}

export async function deleteKubernetes(
  gridClient: GridClient,
  deploymentName: string
): Promise<boolean> {
  const deleteKube = new K8SDeleteModel();
  deleteKube.name = deploymentName;
  const result = await gridClient.k8s.delete(deleteKube);
  return checkResult(result, deploymentName);
}

export async function deleteWorker(
  gridClient: GridClient,
  workerName: string,
  deploymentName: string,
): Promise<boolean> {
  const deleteWorkerModel = new DeleteWorkerModel();
  deleteWorkerModel.deployment_name = deploymentName;
  deleteWorkerModel.name = workerName;
  const result = gridClient.k8s.deleteWorker(deleteWorkerModel);
  return checkResult(result, workerName);
}

export async function deleteZdbs(
  gridClient: GridClient,
  deploymentName: string,
): Promise<boolean> {
  const deleteZdb = new ZDBDeleteModel();
  deleteZdb.name = deploymentName;
  const result = await gridClient.zdbs.delete(deleteZdb);
  return checkResult(result, deploymentName);
}

export async function deleteZdb(
  gridClient: GridClient,
  zdbName: string,
  deploymentName: string,
): Promise<boolean> {
  const deleteZdbPayload = new DeleteZDBModel();
  deleteZdbPayload.deployment_name = deploymentName;
  deleteZdbPayload.name = zdbName; //prettier-ignore
  const result = gridClient.zdbs.deleteZdb(deleteZdbPayload);
  return checkResult(result, zdbName);
}
// Not Implemented in grid3 client
// export async function deleteQsfsZdbs(
//   gridClient: GridClient,
//   deploymentName: string,
// ): Promise<boolean> {
//   return false;
// }

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
