<script lang="ts">
  import codeStore from "../store/code.store";
  import mnemonicsStore from "../store/mnemonics.store";
  import { HTTPMessageBusClient } from "ts-rmb-http-client";
  import {
    Network,
    TwinDeploymentHandler,
    VirtualMachine,
    VirtualMachineDisk,
    Kubernetes,
    KubernetesNode,
    Machine,
    Machines,
    K8s,
    K8S,
  } from "grid3_client_ts";
  import { Resource, VM } from "src/models";

  $: store = $codeStore;
  $: active = store.active > -1;

  let mnemonicsIsNeeded = false;

  const open = () => (mnemonicsIsNeeded = true);
  const close = () => (mnemonicsIsNeeded = false);

  $: mnemStore = $mnemonicsStore;
  $: disabled = mnemStore.mnemonics.length === 0 || mnemStore.twinId.length === 0; // prettier-ignore

  async function deployVM(
    network: Network,
    twinId: string,
    explorerUrl: string,
    mnemonics: string,
    rmb: HTTPMessageBusClient,
    virtualMachine: VM,
    nodeId: number
  ) {
    const vm = new VirtualMachine(+twinId, explorerUrl, mnemonics, rmb);
    // const vms = project.resources.map((r) => r.vms).flat();
    const disks = virtualMachine.disks.map((disk) => {
      const d = new VirtualMachineDisk();
      d.name = disk.name;
      d.size = disk.size;
      d.mountpoint = disk.mount;
      return d;
    });

    const envs = virtualMachine.env_vars.reduce((res, { key, value }) => {
      res[key] = value;
      return res;
    }, {});
    const [deployments, wgConfig] = await vm.create(
      virtualMachine.name,
      nodeId,
      virtualMachine.flist,
      virtualMachine.cpu,
      virtualMachine.memory,
      virtualMachine.rootFsSize, // Add rootfs_size Number in GB
      disks,
      virtualMachine.publicIp,
      virtualMachine.planetary, // Add to VM Boolean
      network,
      virtualMachine.entrypoint,
      envs,
      "",
      ""
    );
    console.log(deployments)
    console.log(wgConfig)

    const twinHandler = new TwinDeploymentHandler(
      rmb,
      +twinId,
      explorerUrl,
      mnemonics
    );
    const result = await twinHandler.handle(deployments);
    // it can return contract id or error
    // contract id can be used later to cancel contract

    return { result, wgConfig };
  }

  async function deployKubernetes(
    twinId: string,
    explorerUrl: string,
    mnemonics: string,
    rmb: HTTPMessageBusClient,
    network: Network,
    resource: Resource
  ) {
    const k8s = new K8s(+twinId, explorerUrl, mnemonics, rmb);
    const kubernetes = new Kubernetes(+twinId, explorerUrl, mnemonics, rmb);
    const masters = resource.masters.map((m) => {
      let k = new KubernetesNode();
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
      let k = new KubernetesNode();
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
  }

  async function deployZDB() {}

  async function onDeployHandler() {
    close();

    const rmb = new HTTPMessageBusClient(+mnemStore.twinId, mnemStore.proxyUrl);

    const project = store.projects[store.active];
    const nw = project.network;
    const { twinId, explorerUrl, mnemonics, proxyUrl } = mnemStore;
    const network = new Network(nw.name, nw.ipRange, rmb);
    let results = new Map();
    for (let r of project.resources) {
      if (r.type === "deployment") {
        for (let c of r.vms) {
          const data = await deployVM(
            network,
            twinId,
            explorerUrl,
            mnemonics,
            rmb,
            c,
            r.node
          );
          console.log(data);
          results.set(c.name, data);
        }
      } else if (r.type === "kubernetes") {
        /* Kubernetes */
        const data = await deployKubernetes(
          twinId,
          explorerUrl,
          mnemonics,
          rmb,
          network,
          project.resources[0]
        );
      }
    }

    // console.log(data);
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

      textarea,
      input {
        max-width: 100%;
        width: 100%;
        height: 20rem;
        resize: none;
        border-radius: 5px;
        border-color: #ccc;
        padding: 1.5rem;
        margin-bottom: 1rem;
        outline: none !important;

        &:hover,
        &:focus {
          border-color: darken(#ccc, 20);
        }
      }

      input {
        height: auto;
        border-width: 1px;
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
