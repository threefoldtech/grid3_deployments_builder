import { HTTPMessageBusClient } from "ts-rmb-http-client";
import { Resource, Worker, VM, ZDB, Project } from "../models";
import codeStore from "../store/code.store";
import { addToast } from "../store/toast.store";
import {
  NetworkModel,
  DiskModel,
  KubernetesNodeModel,
  MachineModule,
  MachineModel,
  MachinesModel,
  K8sModule,
  K8SModel,
  AddWorkerModel,
  AddMachineModel,
  AddZDBModel,
  ZDBModel,
  ZDBSModel,
  ZdbsModule,
  ZdbModes,
  DeviceTypes,
} from "grid3_client_ts";

function checkResult(result): boolean {
  if (result.contracts.created.length || result.contracts.updated.length) {
    return true;
  }
  return false;
}

async function handleVMs(
  network: NetworkModel,
  twinId: string,
  explorerUrl: string,
  mnemonics: string,
  rmb: HTTPMessageBusClient,
  project: Project,
  resourceId: number
) {
  let resource = project.resources[resourceId];
  // Check if deployment already deployed before, Will add new vm only.
  if (resource.isDeployed) {
    let is_changed: boolean = false; // flag to check if no change happen
    for (let [i, vm] of resource.vms.entries()) {
      // If vm is not deployed --> add new vm to the current deployment
      if (!vm.isDeployed) {
        is_changed = true;
        const vmResult = await addVM(
          twinId,
          explorerUrl,
          mnemonics,
          rmb,
          vm,
          resource.name,
          project.name
        );
        if (checkResult(vmResult)) {
          addToast({
            message: `${vm.name} added successfully`,
            type: "success",
            dismissible: true,
            timeout: 3000,
          });
          codeStore.updateDeployOneElement(resourceId, i);
        } else {
          addToast({
            message: `Error happen while adding ${vm.name}`,
            type: "error",
            dismissible: true,
            timeout: 3000,
          });
        }
      }
    }
    if (!is_changed) {
      addToast({
        message: "No new machine added, all VMs already deployed",
        type: "info",
        dismissible: true,
        timeout: 3000,
      });
    }
  } else {
    const vmResult = await deployVMs(
      network,
      twinId,
      explorerUrl,
      mnemonics,
      rmb,
      resource,
      project.name
    );
    if (checkResult(vmResult)) {
      addToast({
        message: `${resource.name} deployed successfully`,
        type: "success",
        dismissible: true,
        timeout: 3000,
      });
      codeStore.updateDeployAllElements(resourceId);
    } else {
      addToast({
        message: `Error happen while deploying ${resource.name}`,
        type: "error",
        dismissible: true,
        timeout: 3000,
      });
    }
  }
}

async function handleKubernetes(
  network: NetworkModel,
  twinId: string,
  explorerUrl: string,
  mnemonics: string,
  rmb: HTTPMessageBusClient,
  project: Project,
  resourceId: number
) {
  let resource = project.resources[resourceId];
  // Check if deployment already deployed before, Will add new workers only.
  if (resource.isDeployed) {
    let is_changed = false; // flag to check if no change happen
    for (let [i, w] of resource.workers.entries()) {
      if (!w.isDeployed) {
        is_changed = true;
        const addWorkerResult = await addWorker(
          twinId,
          explorerUrl,
          mnemonics,
          rmb,
          w,
          resource.name,
          project.name
        );
        if (checkResult(addWorkerResult)) {
          addToast({
            message: `${w.name} added successfully`,
            type: "success",
            dismissible: true,
            timeout: 3000,
          });
          codeStore.updateDeployOneElement(resourceId, i);
        } else {
          addToast({
            message: `Error happen while adding ${w.name}`,
            type: "error",
            dismissible: true,
            timeout: 3000,
          });
        }
      }
    }
    if (!is_changed) {
      addToast({
        message: "No new workers added, all workers already deployed",
        type: "info",
        dismissible: true,
        timeout: 3000,
      });
    }
  } else {
    const kubernetsResult = await deployKubernetes(
      twinId,
      explorerUrl,
      mnemonics,
      rmb,
      network,
      resource,
      project.name
    );
    if (checkResult(kubernetsResult)) {
      addToast({
        message: `${resource.name} deployed successfully`,
        type: "success",
        dismissible: true,
        timeout: 3000,
      });
      codeStore.updateDeployAllElements(resourceId);
    } else {
      addToast({
        message: `Error happen while deploying ${resource.name}`,
        type: "error",
        dismissible: true,
        timeout: 3000,
      });
    }
  }
}

async function handleZDBs(
  twinId: string,
  explorerUrl: string,
  mnemonics: string,
  rmb: HTTPMessageBusClient,
  project: Project,
  resourceId: number
) {
  let resource = project.resources[resourceId];
  // Check if deployment already deployed before, Will add new workers only.
  if (resource.isDeployed) {
    let is_changed = false; // flag to check if no change happen
    for (let [i, z] of resource.zdbs.entries()) {
      if (!z.isDeployed) {
        is_changed = true;
        const addZdbResult = await addZDB(
          twinId,
          explorerUrl,
          mnemonics,
          rmb,
          z,
          resource.name,
          project.name
        );
        if (checkResult(addZdbResult)) {
          addToast({
            message: `${z.name} added successfully`,
            type: "success",
            dismissible: true,
            timeout: 3000,
          });
          codeStore.updateDeployOneElement(resourceId, i);
        } else {
          addToast({
            message: `Error happen while adding ${z.name}`,
            type: "error",
            dismissible: true,
            timeout: 3000,
          });
        }
      }
    }
    if (!is_changed) {
      addToast({
        message: "No new zdbs added, all zdbs already deployed",
        type: "info",
        dismissible: true,
        timeout: 3000,
      });
    }
  } else {
    const zdbsResult = await deployZDBs(
      twinId,
      explorerUrl,
      mnemonics,
      rmb,
      resource,
      project.name
    );
    if (checkResult(zdbsResult)) {
      addToast({
        message: `${resource.name} deployed successfully`,
        type: "success",
        dismissible: true,
        timeout: 3000,
      });
      codeStore.updateDeployAllElements(resourceId);
    } else {
      addToast({
        message: `Error happen while deploying ${resource.name}`,
        type: "error",
        dismissible: true,
        timeout: 3000,
      });
    }
  }
}

// Deploy VM Function
async function deployVMs(
  network: NetworkModel,
  twinId: string,
  explorerUrl: string,
  mnemonics: string,
  rmb: HTTPMessageBusClient,
  resource: Resource,
  projectName: string
) {
  const vmDeployer = new MachineModule(+twinId, explorerUrl, mnemonics, rmb);
  vmDeployer.fileName = projectName + "/" + vmDeployer.fileName;
  // Construct Machines
  const vmsModel = resource.vms.map((vm) => {
    let vmModel = new MachineModel();
    vmModel.name = vm.name;
    vmModel.node_id = vm.node;
    vmModel.flist = vm.flist;
    vmModel.cpu = vm.cpu;
    vmModel.memory = vm.memory;
    vmModel.rootfs_size = vm.rootFsSize;
    vmModel.entrypoint = vm.entrypoint;
    vmModel.public_ip = vm.publicIp;
    vmModel.planetary = vm.planetary;
    vmModel.disks = vm.disks.map((disk) => {
      const d = new DiskModel();
      d.name = disk.name;
      d.size = disk.size;
      d.mountpoint = disk.mount;
      return d;
    });
    vmModel.env = vm.env_vars.reduce((res, { key, value }) => {
      res[key] = value;
      return res;
    }, {});
    return vmModel;
  });

  // Construct Machines Payload
  const vmsPayload = new MachinesModel();
  vmsPayload.name = resource.name;
  vmsPayload.machines = vmsModel;
  vmsPayload.network = network;
  vmsPayload.description = resource.description;
  vmsPayload.metadata = resource.metadata;

  // Deploy
  const result = vmDeployer.deploy(vmsPayload);
  return result;
}

async function addVM(
  twinId: string,
  explorerUrl: string,
  mnemonics: string,
  rmb: HTTPMessageBusClient,
  machine: VM,
  deploymentName: string,
  projectName: string
) {
  const vmDeployer = new MachineModule(+twinId, explorerUrl, mnemonics, rmb);
  vmDeployer.fileName = projectName + "/" + vmDeployer.fileName;
  let addVMPayload = new AddMachineModel();
  addVMPayload.deployment_name = deploymentName;
  addVMPayload.name = machine.name;
  addVMPayload.node_id = machine.node;
  addVMPayload.cpu = machine.cpu;
  addVMPayload.memory = machine.memory;
  addVMPayload.public_ip = machine.publicIp;
  addVMPayload.rootfs_size = machine.rootFsSize;
  addVMPayload.planetary = machine.planetary;
  addVMPayload.disks = machine.disks.map((disk) => {
    const d = new DiskModel();
    d.name = disk.name;
    d.size = disk.size;
    d.mountpoint = disk.mount;
    return d;
  });
  addVMPayload.env = machine.env_vars.reduce((res, { key, value }) => {
    res[key] = value;
    return res;
  }, {});
  const result = vmDeployer.addMachine(addVMPayload);
  return result;
}

// Deploy Kubernetes Function
async function deployKubernetes(
  twinId: string,
  explorerUrl: string,
  mnemonics: string,
  rmb: HTTPMessageBusClient,
  network: NetworkModel,
  resource: Resource,
  projectName: string
) {
  const k8sDeployer = new K8sModule(+twinId, explorerUrl, mnemonics, rmb);
  k8sDeployer.fileName = projectName + "/" + k8sDeployer.fileName;
  const masters = resource.masters.map((m) => {
    let k = new KubernetesNodeModel();
    k.name = m.name;
    k.node_id = m.node;
    k.cpu = m.cpu;
    k.disk_size = m.diskSize;
    k.memory = m.memory;
    k.public_ip = m.publicIp;
    k.rootfs_size = m.rootFsSize;
    k.planetary = m.planetary;
    return k;
  });

  const workers = resource.workers.map((w) => {
    let k = new KubernetesNodeModel();
    k.name = w.name;
    k.node_id = w.node;
    k.cpu = w.cpu;
    k.disk_size = w.diskSize;
    k.memory = w.memory;
    k.public_ip = w.publicIp;
    k.rootfs_size = w.rootFsSize;
    k.planetary = w.planetary;
    return k;
  });
  let kubernetesPayload = new K8SModel();
  kubernetesPayload.name = resource.name;
  kubernetesPayload.secret = resource.secret;
  kubernetesPayload.network = network;
  kubernetesPayload.masters = masters;
  kubernetesPayload.workers = workers;
  kubernetesPayload.metadata = resource.metadata;
  kubernetesPayload.description = resource.description;
  kubernetesPayload.ssh_key = resource.sshKey;
  const result = k8sDeployer.deploy(kubernetesPayload);
  return result;
}

async function addWorker(
  twinId: string,
  explorerUrl: string,
  mnemonics: string,
  rmb: HTTPMessageBusClient,
  worker: Worker,
  deploymentName: string,
  projectName: string
) {
  const k8sDeployer = new K8sModule(+twinId, explorerUrl, mnemonics, rmb);
  k8sDeployer.fileName = projectName + "/" + k8sDeployer.fileName;
  let addWorkerPayload = new AddWorkerModel();
  addWorkerPayload.deployment_name = deploymentName;
  addWorkerPayload.name = worker.name;
  addWorkerPayload.node_id = worker.node;
  addWorkerPayload.cpu = worker.cpu;
  addWorkerPayload.disk_size = worker.diskSize;
  addWorkerPayload.memory = worker.memory;
  addWorkerPayload.public_ip = worker.publicIp;
  addWorkerPayload.rootfs_size = worker.rootFsSize;
  addWorkerPayload.planetary = worker.planetary;
  const result = k8sDeployer.addWorker(addWorkerPayload);
  return result;
}

async function deployZDBs(
  twinId: string,
  explorerUrl: string,
  mnemonics: string,
  rmb: HTTPMessageBusClient,
  resource: Resource,
  projectName: string
) {
  const zdbsDeployer = new ZdbsModule(+twinId, explorerUrl, mnemonics, rmb);
  zdbsDeployer.fileName = projectName + "/" + zdbsDeployer.fileName;
  const zdbs = resource.zdbs.map((z) => {
    let zdb = new ZDBModel();
    zdb.name = z.name;
    zdb.node_id = z.node;
    zdb.mode = z.mode as ZdbModes;
    zdb.disk_size = z.size;
    zdb.disk_type = z.diskType as DeviceTypes;
    zdb.public = z.publicIp;
    zdb.namespace = z.namespace;
    zdb.password = z.password;
    return zdb;
  });
  let zdbsPayload = new ZDBSModel();
  zdbsPayload.name = resource.name + "ZDBs";
  zdbsPayload.zdbs = zdbs;
  zdbsPayload.description = resource.description;
  zdbsPayload.metadata = resource.metadata;
  const data = zdbsDeployer.deploy(zdbsPayload);
  return data;
}

async function addZDB(
  twinId: string,
  explorerUrl: string,
  mnemonics: string,
  rmb: HTTPMessageBusClient,
  zdb: ZDB,
  deploymentName: string,
  projectName: string
) {
  const zdbsDeployer = new ZdbsModule(+twinId, explorerUrl, mnemonics, rmb);
  zdbsDeployer.fileName = projectName + "/" + zdbsDeployer.fileName;
  let zdbPaylaod = new AddZDBModel();
  zdbPaylaod.deployment_name = deploymentName;
  zdbPaylaod.name = zdb.name;
  zdbPaylaod.node_id = zdb.node;
  zdbPaylaod.mode = zdb.mode as ZdbModes;
  zdbPaylaod.disk_size = zdb.size;
  zdbPaylaod.disk_type = zdb.diskType as DeviceTypes;
  zdbPaylaod.public = zdb.publicIp;
  zdbPaylaod.namespace = zdb.namespace;
  zdbPaylaod.password = zdb.password;
  const result = zdbsDeployer.addZdb(zdbPaylaod);
  return result;
}

export { handleKubernetes, handleVMs, handleZDBs };
