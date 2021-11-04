import {
  Worker,
  Machine,
  ZDB,
  Project,
  Machines,
  Kubernetes,
  ZDBs,
  Resource,
  QsfsZDBs,
} from "../models";
import codeStore from "../store/code.store";
import {
  addSuccessToast,
  addInfoToast,
  addErrorToast,
} from "../store/toast.store";
import {
  GridClient,
  NetworkModel,
  DiskModel,
  KubernetesNodeModel,
  MachineModel,
  MachinesModel,
  K8SModel,
  AddWorkerModel,
  AddMachineModel,
  AddZDBModel,
  ZDBModel,
  ZDBSModel,
  ZdbModes,
  QSFSZDBSModel,
  QSFSDiskModel
} from "grid3_client";

function checkResult(result): boolean {
  if (result.contracts.created.length || result.contracts.updated.length) {
    return true;
  }
  return false;
}

function getNetworkModel(project: Project): NetworkModel {
  const nw = project.network;
  let network = new NetworkModel;
  network.name = nw.name;
  network.ip_range = nw.ipRange;
  return network;
}

async function handleVMs(
  network: NetworkModel,
  projectResource: Resource,
  resourceId: number,
  gridClient: GridClient
) {
  let resource =   projectResource as Machines;
  // Check if deployment already deployed before, Will add new vm only.
  if (resource.isDeployed) {
    let is_changed: boolean = false; // flag to check if no change happen
    for (let [i, vm] of resource.machines.entries()) {
      // If vm is not deployed --> add new vm to the current deployment
      if (!vm.isDeployed) {
        is_changed = true;
        const vmResult = await addVM(vm, resource.name, gridClient);
        if (checkResult(vmResult)) {
          addSuccessToast(`${vm.name} added successfully`);
          codeStore.updateDeployOneElement(resourceId, i);
        } else {
          addErrorToast(`Error happen while adding ${vm.name}`);
        }
      }
    }
    if (!is_changed) {
      addInfoToast("No new machine added, all VMs already deployed");
    }
  } else {
    const vmResult = await deployVMs(network, resource, gridClient);
    if (checkResult(vmResult)) {
      addSuccessToast(`${resource.name} deployed successfully`);
      codeStore.updateDeployAllElements(resourceId);
    } else {
      addErrorToast(`Error happen while deploying ${resource.name}`);
    }
  }
}

async function handleKubernetes(
  network: NetworkModel,
  projectResource: Resource,
  resourceId: number,
  gridClient: GridClient
) {
  let resource = projectResource as Kubernetes;
  // Check if deployment already deployed before, Will add new workers only.
  if (resource.isDeployed) {
    let is_changed = false; // flag to check if no change happen
    for (let [i, w] of resource.workers.entries()) {
      if (!w.isDeployed) {
        is_changed = true;
        const addWorkerResult = await addWorker(w, resource.name, gridClient);
        if (checkResult(addWorkerResult)) {
          addSuccessToast(`${w.name} added successfully`);
          codeStore.updateDeployOneElement(resourceId, i);
        } else {
          addErrorToast(`Error happen while adding ${w.name}`);
        }
      }
    }
    if (!is_changed) {
      addInfoToast("No new workers added, all workers already deployed");
    }
  } else {
    const kubernetsResult = await deployKubernetes(
      network,
      resource,
      gridClient
    );
    if (checkResult(kubernetsResult)) {
      addSuccessToast(`${resource.name} deployed successfully`);
      codeStore.updateDeployAllElements(resourceId);
    } else {
      addErrorToast(`Error happen while deploying ${resource.name}`);
    }
  }
}

async function handleZDBs(
  projectResource: Resource,
  resourceId: number,
  gridClient: GridClient
) {
  let resource = projectResource as ZDBs;
  // Check if deployment already deployed before, Will add new workers only.
  if (resource.isDeployed) {
    let is_changed = false; // flag to check if no change happen
    for (let [i, z] of resource.zdbs.entries()) {
      if (!z.isDeployed) {
        is_changed = true;
        const addZdbResult = await addZDB(z, resource.name, gridClient);
        if (checkResult(addZdbResult)) {
          addSuccessToast(`${z.name} added successfully`);
          codeStore.updateDeployOneElement(resourceId, i);
        } else {
          addErrorToast(`Error happen while adding ${z.name}`);
        }
      }
    }
    if (!is_changed) {
      addInfoToast("No new zdbs added, all zdbs already deployed");
    }
  } else {
    const zdbsResult = await deployZDBs(resource, gridClient);
    if (checkResult(zdbsResult)) {
      addSuccessToast(`${resource.name} deployed successfully`);
      codeStore.updateDeployAllElements(resourceId);
    } else {
      addErrorToast(`Error happen while deploying ${resource.name}`);
    }
  }
}

// Deploy VM Function
async function deployVMs(
  network: NetworkModel,
  resource: Machines,
  gridClient: GridClient
) {
  // Construct Machines
  const vmsModel = resource.machines.map((vm) => {
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
    vmModel.qsfs_disks = vm.qsfsDisks.map((qsfsDisk) => {
      const qd = new QSFSDiskModel();
      qd.name = qsfsDisk.name;
      qd.qsfs_zdbs_name = qsfsDisk.qsfsZdbsName;
      qd.prefix = qsfsDisk.prefix;
      qd.encryption_key = qsfsDisk.encryptionKey;
      qd.cache = qsfsDisk.cache;
      qd.minimal_shards = qsfsDisk.minimalShards;
      qd.expected_shards = qsfsDisk.expectedShards;
      qd.mountpoint = qsfsDisk.mountpoint;
      return qd;
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
  const result = gridClient.machines.deploy(vmsPayload);
  return result;
}

async function addVM(
  machine: Machine,
  deploymentName: string,
  gridClient: GridClient
) {
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
  addVMPayload.qsfs_disks = machine.qsfsDisks.map((qsfsDisk) => {
    const qd = new QSFSDiskModel();
    qd.name = qsfsDisk.name;
    qd.qsfs_zdbs_name = qsfsDisk.qsfsZdbsName;
    qd.prefix = qsfsDisk.prefix;
    qd.encryption_key = qsfsDisk.encryptionKey;
    qd.cache = qsfsDisk.cache;
    qd.minimal_shards = qsfsDisk.minimalShards;
    qd.expected_shards = qsfsDisk.expectedShards;
    qd.mountpoint = qsfsDisk.mountpoint;
    return qd;
  });
  addVMPayload.env = machine.env_vars.reduce((res, { key, value }) => {
    res[key] = value;
    return res;
  }, {});
  const result = gridClient.machines.add_machine(addVMPayload);
  return result;
}

// Deploy Kubernetes Function
async function deployKubernetes(
  network: NetworkModel,
  resource: Kubernetes,
  gridClient: GridClient
) {
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
  const result = gridClient.k8s.deploy(kubernetesPayload);
  return result;
}

async function addWorker(
  worker: Worker,
  deploymentName: string,
  gridClient: GridClient
) {
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
  const result = gridClient.k8s.add_worker(addWorkerPayload);
  return result;
}

async function deployZDBs(resource: ZDBs, gridClient: GridClient) {
  const zdbs = resource.zdbs.map((z) => {
    let zdb = new ZDBModel();
    zdb.name = z.name;
    zdb.node_id = z.node;
    zdb.mode = z.mode as ZdbModes;
    zdb.disk_size = z.size;
    zdb.public_ipv6 = z.publicIp;
    zdb.password = z.password;
    return zdb;
  });
  let zdbsPayload = new ZDBSModel();
  zdbsPayload.name = resource.name;
  zdbsPayload.zdbs = zdbs;
  zdbsPayload.description = resource.description;
  zdbsPayload.metadata = resource.metadata;
  const data = gridClient.zdbs.deploy(zdbsPayload);
  return data;
}

async function addZDB(
  zdb: ZDB,
  deploymentName: string,
  gridClient: GridClient
) {
  // gridClient.project_name = projectName;
  let zdbPaylaod = new AddZDBModel();
  zdbPaylaod.deployment_name = deploymentName;
  zdbPaylaod.name = zdb.name;
  zdbPaylaod.node_id = zdb.node;
  zdbPaylaod.mode = zdb.mode as ZdbModes;
  zdbPaylaod.disk_size = zdb.size;
  zdbPaylaod.public_ipv6 = zdb.publicIp;
  zdbPaylaod.password = zdb.password;
  const result = gridClient.zdbs.add_zdb(zdbPaylaod);
  return result;
}

async function deployQsfsZdb(resource: QsfsZDBs, resourceId:number, gridClient: GridClient){
  if (!resource.isDeployed){
    let qsfsZdbs = new QSFSZDBSModel()
    qsfsZdbs.name = resource.name;
    qsfsZdbs.count = resource.count;
    qsfsZdbs.node_ids = resource.nodeIds;
    qsfsZdbs.disk_size = resource.diskSize;
    qsfsZdbs.password = resource.password;
    qsfsZdbs.metadata = resource.metadata;
    qsfsZdbs.description = resource.description;
  
    const data = await gridClient.qsfs_zdbs.deploy(qsfsZdbs);
    if (checkResult(data)) {
      addSuccessToast(`${resource.name} deployed successfully`);
      codeStore.updateDeployAllElements(resourceId);
    } else {
      addErrorToast(`Error happen while deploying ${resource.name}`);
    }
  }else{
    addInfoToast(`QSFS Zdbs ${resource.name} already deployed`)
  }
 
}

export { getNetworkModel, handleKubernetes, handleVMs, handleZDBs, deployQsfsZdb };
