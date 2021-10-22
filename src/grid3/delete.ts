import { HTTPMessageBusClient } from "ts-rmb-http-client";
import codeStore from "../store/code.store";
import {
  addSuccessToast,
  addInfoToast,
  addErrorToast,
} from "../store/toast.store";
import {
  GWModule,
  MachineModule,
  K8sModule,
  ZdbsModule,
  MachinesDeleteModel,
  K8SDeleteModel,
  ZDBDeleteModel,
  DeleteZDBModel,
  DeleteWorkerModel,
  DeleteMachineModel,
  // QSFSZdbsModule // ######## Not Exported ########
} from "grid3_client_ts";

function checkResult(result, deploymentName): boolean {
  if (result.contracts.deleted.length || result.contracts.updated.length) {
    addSuccessToast(`${deploymentName} deleted successfully`);
    return true;
  } else {
    addErrorToast(`Error happen while deleting ${deploymentName}`);
    return false;
  }
}

export async function deleteMachines(
  mnemStore,
  deploymentName: string,
  projectName: string
): Promise<boolean> {
  const rmb = new HTTPMessageBusClient(mnemStore.twinId, mnemStore.proxyUrl);
  const machineDeployer = new MachineModule(
    mnemStore.twinId,
    mnemStore.explorerUrl,
    mnemStore.mnemonics,
    rmb
  );
  machineDeployer.projectName = projectName;
  const deleteMachines = new MachinesDeleteModel();
  deleteMachines.name = deploymentName;
  const result = await machineDeployer.delete(deleteMachines);
  return checkResult(result, deploymentName);
}

export async function deleteMachine(
  mnemStore,
  machineName: string,
  deploymentName: string,
  projectName: string
): Promise<boolean> {
  const rmb = new HTTPMessageBusClient(mnemStore.twinId, mnemStore.proxyUrl);
  const vmDeployer = new MachineModule(
    mnemStore.twinId,
    mnemStore.explorerUrl,
    mnemStore.mnemonics,
    rmb
  );
  vmDeployer.projectName = projectName;
  const deleteVM = new DeleteMachineModel();
  deleteVM.deployment_name = deploymentName;
  deleteVM.name = machineName;
  const result = vmDeployer.deleteMachine(deleteVM)
  return checkResult(result, machineName);
}

export async function deleteKubernetes(
  mnemStore,
  deploymentName: string,
  projectName: string
): Promise<boolean> {
  const rmb = new HTTPMessageBusClient(mnemStore.twinId, mnemStore.proxyUrl);
  const kubeDeployer = new K8sModule(
    mnemStore.twinId,
    mnemStore.explorerUrl,
    mnemStore.mnemonics,
    rmb
  );
  kubeDeployer.projectName = projectName;
  const deleteKube = new K8SDeleteModel();
  deleteKube.name = deploymentName;
  const result = await kubeDeployer.delete(deleteKube);
  return checkResult(result, deploymentName);
}

export async function deleteWorker(
  mnemStore,
  workerName: string,
  deploymentName: string,
  projectName: string
): Promise<boolean> {
  const rmb = new HTTPMessageBusClient(mnemStore.twinId, mnemStore.proxyUrl);
  const kubeDeployer = new K8sModule(
    mnemStore.twinId,
    mnemStore.explorerUrl,
    mnemStore.mnemonics,
    rmb
  );
  kubeDeployer.projectName = projectName;
  const deleteWorkerModel = new DeleteWorkerModel();
  deleteWorkerModel.deployment_name = deploymentName;
  deleteWorkerModel.name = workerName;
  const result = kubeDeployer.deleteWorker(deleteWorkerModel)
  return checkResult(result, workerName);
}

export async function deleteZdbs(
  mnemStore,
  deploymentName: string,
  projectName: string
): Promise<boolean> {
  const rmb = new HTTPMessageBusClient(mnemStore.twinId, mnemStore.proxyUrl);
  const zdbDeployer = new ZdbsModule(
    mnemStore.twinId,
    mnemStore.explorerUrl,
    mnemStore.mnemonics,
    rmb
  );
  zdbDeployer.projectName = projectName;
  const deleteZdb = new ZDBDeleteModel();
  deleteZdb.name = deploymentName;
  const result = await zdbDeployer.delete(deleteZdb);
  return checkResult(result, deploymentName);
}

export async function deleteZdb(
  mnemStore,
  zdbName:string,
  deploymentName: string,
  projectName: string
): Promise<boolean> {
  const rmb = new HTTPMessageBusClient(mnemStore.twinId, mnemStore.proxyUrl);
  const zdbDeployer = new ZdbsModule(
    mnemStore.twinId,
    mnemStore.explorerUrl,
    mnemStore.mnemonics,
    rmb
  );
  zdbDeployer.projectName = projectName
  const deleteZdbPayload = new DeleteZDBModel();
  deleteZdbPayload.deployment_name = deploymentName
  deleteZdbPayload.name = zdbName; //prettier-ignore
  const result = zdbDeployer.deleteZdb(deleteZdbPayload)
  return checkResult(result, zdbName)
}
// Not Implemented in grid3 client
// export async function deleteQsfsZdbs(
//   mnemStore,
//   deploymentName: string,
//   projectName: string
// ): Promise<boolean> {
//   const rmb = new HTTPMessageBusClient(mnemStore.twinId, mnemStore.proxyUrl);
//   return false;
// }

// export async function deleteFqdnGateway(
//   mnemStore,
//   deploymentName: string,
//   projectName: string
// ) Promise<boolean> {
//   const rmb = new HTTPMessageBusClient(mnemStore.twinId, mnemStore.proxyUrl);
//   const zdbDeployer = new GWModule(
//     mnemStore.twinId,
//     mnemStore.explorerUrl,
//     mnemStore.mnemonics,
//     rmb
//   );
//   // zdbDeployer.projectName = projectName;
//   // const deleteZdb = new ZDBDeleteModel();
//   // deleteZdb.name = deploymentName;
//   // const result = await zdbDeployer.delete(deleteZdb);
//   // return checkResult(result, deploymentName);
// }

// export async function deleteNameGateway(
//   mnemStore,
//   deploymentName: string,
//   projectName: string
// ) Promise<boolean> {
//   const rmb = new HTTPMessageBusClient(mnemStore.twinId, mnemStore.proxyUrl);
//   return false;
// }
