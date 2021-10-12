<script lang="ts">
  import codeStore from "../store/code.store";
  import mnemonicsStore from "../store/mnemonics.store";
  import { HTTPMessageBusClient } from "ts-rmb-http-client";
  import {
    NetworkModel,
    DiskModel,
    KubernetesNodeModel,
    MachineModule,
    MachineModel,
    MachinesModel,
    K8sModule,
    K8SModel,
    ZDBModel,
    ZDBSModel,
    ZdbsModule,
    ZdbModes,
    DeviceTypes,
  } from "grid3_client_ts";
  import { Resource } from "src/models";

  $: store = $codeStore;
  $: active = store.active > -1;

  let mnemonicsIsNeeded = false;

  const open = () => (mnemonicsIsNeeded = true);
  const close = () => (mnemonicsIsNeeded = false);

  $: mnemStore = $mnemonicsStore;
  $: disabled = mnemStore.mnemonics.length === 0 || mnemStore.twinId.length === 0; // prettier-ignore

  // Deploy VM Function
  async function deployVM(
    network: NetworkModel,
    twinId: string,
    explorerUrl: string,
    mnemonics: string,
    rmb: HTTPMessageBusClient,
    resource: Resource
  ) {
    const vmDeployer = new MachineModule(+twinId, explorerUrl, mnemonics, rmb);

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

  // Deploy Kubernetes Function
  async function deployKubernetes(
    twinId: string,
    explorerUrl: string,
    mnemonics: string,
    rmb: HTTPMessageBusClient,
    network: NetworkModel,
    resource: Resource
  ) {
    const k8s = new K8sModule(+twinId, explorerUrl, mnemonics, rmb);
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
    const result = k8s.deploy(kubernetesPayload);
    return result;
  }

  async function deployZDB(
    twinId: string,
    explorerUrl: string,
    mnemonics: string,
    rmb: HTTPMessageBusClient,
    resource: Resource
  ) {
    const zdbsDeployer = new ZdbsModule(+twinId, explorerUrl, mnemonics, rmb);
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

  async function onDeployHandler() {
    close();
    const rmb = new HTTPMessageBusClient(+mnemStore.twinId, mnemStore.proxyUrl);

    const project = store.projects[store.active];
    const nw = project.network;
    const { twinId, explorerUrl, mnemonics, proxyUrl } = mnemStore;
    const network = new NetworkModel();
    network.name = nw.name;
    network.ip_range = nw.ipRange;
    let results = new Map();
    for (let r of project.resources) {
      if (r.type === "deployment") {
        const vmResult = await deployVM(
          network,
          twinId,
          explorerUrl,
          mnemonics,
          rmb,
          r
        );
        console.log(vmResult);
        results.set(r.name, vmResult);
      } else if (r.type === "kubernetes") {
        /* Kubernetes */
        const kubernetsResult = await deployKubernetes(
          twinId,
          explorerUrl,
          mnemonics,
          rmb,
          network,
          r
        );
        results.set(r.name, kubernetsResult);
      }
      if (r.zdbs) {
          const zdbResult = await deployZDB(
            twinId,
            explorerUrl,
            mnemonics,
            rmb,
            r
          );
          console.log(zdbResult);
          results.set(r.name + "ZDBs", zdbResult);
        }
    }
  }
</script>

{#if mnemonicsIsNeeded}
  <div class="layout">
    <div class="layout__mnemonics">
      <p>You are about to deploy {store.projects[store.active].name}</p>
      <div class="layout__mnemonics__actions">
        <button class="btn btn-sm btn-cancel" on:click={close}>Cancel</button>
        <button
          class="btn btn-sm btn-store"
          {disabled}
          on:click={onDeployHandler}>Confirm</button
        >
      </div>
    </div>
  </div>
{/if}

<button on:click={open} class="btn btn-deploy" disabled={!active}>
  <img src="/assets/deploy.svg" alt="configs" title="Configuration Settings" />
</button>

<style lang="scss" scoped>
  .layout {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(#333, 0.3);

    &__mnemonics {
      background-color: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      min-width: 500px;

      @media (max-width: 550px) {
        min-width: 90%;
      }

      p {
        margin-bottom: 1rem;
      }

      &__actions {
        display: flex;
        justify-content: flex-end;
      }
    }
  }

  .btn {
    border: none;
    border-radius: 0.5rem;
    background-color: #2196f3;
    padding: 1.5rem 3rem;
    font-weight: bold;
    cursor: pointer;
    font-size: 1.6rem;

    &[disabled] {
      background-color: #ccc;
      pointer-events: none;
    }

    &-deploy {
      position: fixed;
      right: 1.5rem;
      bottom: 1.5rem;
      z-index: 1;
      img {
        width: 60px;
        height: 60px;
      }
    }

    &-sm {
      padding: 1rem 2rem;
      font-size: 1.4rem;
      color: white;
    }

    &-cancel {
      background-color: #f44336;
      margin-right: 1rem;
    }

    &-store {
      background-color: #673ab7;
    }
  }
</style>
