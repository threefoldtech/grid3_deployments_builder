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
  GatewayFQDN,
  GatewayName,
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
  ZdbModes
} from "grid3_client";

function checkResult(result): boolean {
  if (result.contracts.created.length || result.contracts.updated.length) {
    return true;
  }
  return false;
}

export function getNetworkModel(project: Project): NetworkModel {
  const nw = project.network;
  let network = new NetworkModel();
  network.name = nw.name;
  network.ip_range = nw.ipRange;
  return network;
}

export async function handleVMs(
  network: NetworkModel,
  projectResource: Resource,
  resourceId: number,
  gridClient: GridClient
) {
  let resource = projectResource as Machines;
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

export async function handleKubernetes(
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

export async function handleZDBs(
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
    return {
      name: vm.name,
      node_id: vm.node,
      flist: vm.flist,
      cpu: vm.cpu,
      memory: vm.memory,
      rootfs_size: vm.rootFsSize,
      entrypoint: vm.entrypoint,
      public_ip: vm.publicIp,
      planetary: vm.planetary,
      disks: vm.disks.map((disk) => {
        return {
          name: disk.name,
          size: disk.size,
          mountpoint: disk.mount,
        };
      }),
      qsfs_disks: vm.qsfsDisks.map((qsfsDisk) => {
        return {
          name: qsfsDisk.name,
          qsfs_zdbs_name: qsfsDisk.qsfsZdbsName,
          prefix: qsfsDisk.prefix,
          encryption_key: qsfsDisk.encryptionKey,
          cache: qsfsDisk.cache,
          minimal_shards: qsfsDisk.minimalShards,
          expected_shards: qsfsDisk.expectedShards,
          mountpoint: qsfsDisk.mountpoint,
        };
      }),
      env: vm.env_vars.reduce((res, { key, value }) => {
        res[key] = value;
        return res;
      }, {}),
    };
  });

  // Deploy
  const result = gridClient.machines.deploy({
    name: resource.name,
    machines: vmsModel,
    network: network,
    description: resource.description,
    metadata: resource.metadata,
  });
  return result;
}

async function addVM(
  machine: Machine,
  deploymentName: string,
  gridClient: GridClient
) {
  const result = gridClient.machines.add_machine({
    deployment_name: deploymentName,
    name: machine.name,
    node_id: machine.node,
    flist: machine.flist,
    cpu: machine.cpu,
    memory: machine.memory,
    rootfs_size: machine.rootFsSize,
    entrypoint: machine.entrypoint,
    public_ip: machine.publicIp,
    planetary: machine.planetary,
    disks: machine.disks.map((disk) => {
      return {
        name: disk.name,
        size: disk.size,
        mountpoint: disk.mount,
      };
    }),
    qsfs_disks: machine.qsfsDisks.map((qsfsDisk) => {
      return {
        name: qsfsDisk.name,
        qsfs_zdbs_name: qsfsDisk.qsfsZdbsName,
        prefix: qsfsDisk.prefix,
        encryption_key: qsfsDisk.encryptionKey,
        cache: qsfsDisk.cache,
        minimal_shards: qsfsDisk.minimalShards,
        expected_shards: qsfsDisk.expectedShards,
        mountpoint: qsfsDisk.mountpoint,
      };
    }),
    env: machine.env_vars.reduce((res, { key, value }) => {
      res[key] = value;
      return res;
    }, {}),
  });
  return result;
}

// Deploy Kubernetes Function
async function deployKubernetes(
  network: NetworkModel,
  resource: Kubernetes,
  gridClient: GridClient
) {
  const masters = resource.masters.map((m) => {
    return {
      name: m.name,
      node_id: m.node,
      cpu: m.cpu,
      disk_size: m.diskSize,
      memory: m.memory,
      public_ip: m.publicIp,
      rootfs_size: m.rootFsSize,
      planetary: m.planetary,
      qsfs_disks: m.qsfsDisks.map((qsfsDisk) => {
        return {
          name: qsfsDisk.name,
          qsfs_zdbs_name: qsfsDisk.qsfsZdbsName,
          prefix: qsfsDisk.prefix,
          encryption_key: qsfsDisk.encryptionKey,
          cache: qsfsDisk.cache,
          minimal_shards: qsfsDisk.minimalShards,
          expected_shards: qsfsDisk.expectedShards,
          mountpoint: qsfsDisk.mountpoint,
        };
      }),
    };
  });

  const workers = resource.workers.map((w) => {
    return {
      name: w.name,
      node_id: w.node,
      cpu: w.cpu,
      disk_size: w.diskSize,
      memory: w.memory,
      public_ip: w.publicIp,
      rootfs_size: w.rootFsSize,
      planetary: w.planetary,
      qsfs_disks: w.qsfsDisks.map((qsfsDisk) => {
        return {
          name: qsfsDisk.name,
          qsfs_zdbs_name: qsfsDisk.qsfsZdbsName,
          prefix: qsfsDisk.prefix,
          encryption_key: qsfsDisk.encryptionKey,
          cache: qsfsDisk.cache,
          minimal_shards: qsfsDisk.minimalShards,
          expected_shards: qsfsDisk.expectedShards,
          mountpoint: qsfsDisk.mountpoint,
        };
      }),
    };
  });
  const result = gridClient.k8s.deploy({
    name: resource.name,
    secret: resource.secret,
    network: network,
    masters: masters,
    workers: workers,
    metadata: resource.metadata,
    description: resource.description,
    ssh_key: resource.sshKey,
  });
  return result;
}

async function addWorker(
  worker: Worker,
  deploymentName: string,
  gridClient: GridClient
) {
  const result = gridClient.k8s.add_worker({
    deployment_name: deploymentName,
    name: worker.name,
    node_id: worker.node,
    cpu: worker.cpu,
    disk_size: worker.diskSize,
    memory: worker.memory,
    public_ip: worker.publicIp,
    rootfs_size: worker.rootFsSize,
    planetary: worker.planetary,
    qsfs_disks: worker.qsfsDisks.map((qsfsDisk) => {
      return {
        name: qsfsDisk.name,
        qsfs_zdbs_name: qsfsDisk.qsfsZdbsName,
        prefix: qsfsDisk.prefix,
        encryption_key: qsfsDisk.encryptionKey,
        cache: qsfsDisk.cache,
        minimal_shards: qsfsDisk.minimalShards,
        expected_shards: qsfsDisk.expectedShards,
        mountpoint: qsfsDisk.mountpoint,
      };
    }),
  });
  return result;
}

async function deployZDBs(resource: ZDBs, gridClient: GridClient) {
  const data = gridClient.zdbs.deploy({
    name: resource.name,
    zdbs: resource.zdbs.map((z) => {
      return {
        name: z.name,
        node_id: z.node,
        mode: z.mode as ZdbModes,
        disk_size: z.size,
        publicNamespace: z.publicIp,
        password: z.password,
      };
    }),
    description: resource.description,
    metadata: resource.metadata,
  });
  return data;
}

async function addZDB(
  zdb: ZDB,
  deploymentName: string,
  gridClient: GridClient
) {
  const result = gridClient.zdbs.add_zdb({
    deployment_name: deploymentName,
    name: zdb.name,
    node_id: zdb.node,
    mode: zdb.mode as ZdbModes,
    disk_size: zdb.size,
    publicNamespace: zdb.publicIp,
    password: zdb.password,
  });
  return result;
}

export async function deployQsfsZdb(
  resource: QsfsZDBs,
  resourceId: number,
  gridClient: GridClient
) {
  if (!resource.isDeployed) {
    const data = await gridClient.qsfs_zdbs.deploy({
      name: resource.name,
      count: resource.count,
      node_ids: resource.nodeIds,
      disk_size: resource.diskSize,
      password: resource.password,
      metadata: resource.metadata,
      description: resource.description
    });
    if (checkResult(data)) {
      addSuccessToast(`${resource.name} deployed successfully`);
      codeStore.updateDeployAllElements(resourceId);
    } else {
      addErrorToast(`Error happen while deploying ${resource.name}`);
    }
  } else {
    addInfoToast(`QSFS Zdbs ${resource.name} already deployed`);
  }
}

export async function deployDomain(
  resource: GatewayFQDN,
  resourceId: number,
  gridClient: GridClient
) {
  if (!resource.isDeployed) {
    const data = await gridClient.gateway.deploy_fqdn({
      name: resource.name,
      node_id: resource.node,
      fqdn: resource.domain,
      backends: resource.backends,
      tls_passthrough: resource.tlsPassThrough
    });
    if (checkResult(data)) {
      addSuccessToast(`${resource.name} deployed successfully`);
      codeStore.updateDeployAllElements(resourceId);
    } else {
      addErrorToast(`Error happen while deploying ${resource.name}`);
    }
  } else {
    addInfoToast(`Domain ${resource.name} already deployed`);
  }
}

export async function deployPrefixDomain(
  resource: GatewayName,
  resourceId: number,
  gridClient: GridClient
) {
  if (!resource.isDeployed) {
    const data = await gridClient.gateway.deploy_name({
      name: resource.prefix,
      node_id: resource.node,
      backends: resource.backends,
      tls_passthrough: resource.tlsPassThrough
    });
    if (checkResult(data)) {
      addSuccessToast(`${resource.name} deployed successfully`);
      codeStore.updateDeployAllElements(resourceId);
    } else {
      addErrorToast(`Error happen while deploying ${resource.name}`);
    }
  } else {
    addInfoToast(`Prefix Domain ${resource.name} already deployed`);
  }
}
