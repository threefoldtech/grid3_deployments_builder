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
  } from "grid3_client_ts";
  import { Resource, VM } from "src/models";

  $: store = $codeStore;
  $: active = store.active > -1;

  let mnemonicsIsNeeded = false;

  const open = () => (mnemonicsIsNeeded = true);
  const close = () => (mnemonicsIsNeeded = false);

  $: mnemStore = $mnemonicsStore;
  $: disabled = mnemStore.mnemonics.length === 0 || mnemStore.twinId.length === 0; // prettier-ignore

  async function deployVm(
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
      disks,
      virtualMachine.publicIp,
      network,
      virtualMachine.entrypoint,
      envs,
      "",
      ""
    );

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
    const kubernetes = new Kubernetes(+twinId, explorerUrl, mnemonics, rmb);
    const addMasters = await Promise.all(
      resource.masters.map((m) =>
        kubernetes.add_master(
          m.name,
          m.node,
          "secret",
          m.cpu,
          m.memory,
          m.diskSize,
          m.publicip,
          network,
          "sshkey",
          "",
          ""
        )
      )
    );

    const addWorkers = await Promise.all(
      resource.workers.map((w) =>
        kubernetes.add_worker(
          w.name,
          w.node,
          "secret",
          "masterIp" /* we need to know how to get master ip */,
          w.cpu,
          w.memory,
          w.diskSize,
          false /* should add publicip to worker */,
          network,
          "sshkey",
          "",
          ""
        )
      )
    );
  }

  async function onDeployHandler() {
    close();

    const rmb = new HTTPMessageBusClient(mnemStore.proxyUrl);

    const project = store.projects[store.active];
    const nw = project.network;
    const { twinId, explorerUrl, mnemonics } = mnemStore;

    const network = new Network(nw.name, nw.ipRange, rmb);
    const data = await deployVm(
      network,
      twinId,
      explorerUrl,
      mnemonics,
      rmb,
      project.resources[0].vms[0],
      project.resources[0].node
    );

    console.log(data /* { result, wgConfig } */);

    /* Kubernetes */
    // const data = await deployKubernetes(
    //   twinId,
    //   explorerUrl,
    //   mnemonics,
    //   rmb,
    //   network,
    //   project.resources[0]
    // );
    // console.log(data);
  }
</script>

{#if mnemonicsIsNeeded}
  <div class="layout">
    <div class="layout__mnemonics">
      <div>
        <p>Please Enter Your Explorer url:</p>
        <input
          placeholder="Explorer url"
          value={mnemStore.explorerUrl}
          on:input={mnemonicsStore.updateExplorerUrl}
        />
      </div>
      <div>
        <p>Please Enter Your RMB proxy url:</p>
        <input
          placeholder="rmb proxy"
          value={mnemStore.proxyUrl}
          on:input={mnemonicsStore.updateProxyUrl}
        />
      </div>
      <div>
        <p>Please Enter Your TwinID:</p>
        <input
          placeholder="twinid"
          value={mnemStore.twinId}
          on:input={mnemonicsStore.updateTwinid}
        />
      </div>
      <div>
        <p>Please Enter Your Mnemonics:</p>
        <textarea
          placeholder="mnemonics"
          value={mnemStore.mnemonics}
          on:input={mnemonicsStore.updateMnemonics}
        />
      </div>
      <div class="layout__mnemonics__actions">
        <button class="btn btn-sm btn-cancel" on:click={close}>Cancel</button>
        <button
          class="btn btn-sm btn-store"
          {disabled}
          on:click={onDeployHandler}>Deploy</button
        >
      </div>
    </div>
  </div>
{/if}

<button on:click={open} class="btn btn-deploy" disabled={!active}>
  Deploy
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
