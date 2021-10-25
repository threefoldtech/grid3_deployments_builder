<script lang="ts">
  import codeStore from "../store/code.store";
  import mnemonicsStore from "../store/mnemonics.store";
  import Toasts from "../components/base/Toasts.svelte";
  import { addToast } from "../store/toast.store";
  import { NetworkModel } from "grid3_client_ts";
  import { getClient, handleKubernetes, handleVMs, handleZDBs, getNetworkModel } from "src/grid3/index";

  $: store = $codeStore;
  $: active = store.active > -1;

  let mnemonicsIsNeeded = false;
  let showResult = false

  const open = () => (mnemonicsIsNeeded = true);
  const close = () => (mnemonicsIsNeeded = false);

  const openResult = () => (showResult = true);
  const closeResult = () => (showResult = false);

  $: mnemStore = $mnemonicsStore;
  $: disabled = mnemStore.mnemonics.length === 0 || mnemStore.twinId.length === 0; // prettier-ignore

  async function onDeployHandler() {
    close();
    const project = store.projects[store.active];
    const network = getNetworkModel(project)
    const gridClient = getClient(mnemStore, project.name); 
    for (let [i, resource] of project.resources.entries()) {
      if (resource.type === "machines") {
        await handleVMs(network, resource, i, gridClient);
      } else if (resource.type === "kubernetes") {
        await handleKubernetes(network, resource, i, gridClient);
      } else if (resource.type === "zdbs") {
        await handleZDBs(resource, i, gridClient);
      } else if (resource.type === "gateways") {
        console.log(resource);
      }
    }
  }

  function onResultsHandler() {
    return "I'm the result :P";
  }
</script>

<Toasts />

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

{#if showResult}
  <div class="layout">
    <div class="layout__mnemonics">
      <p>{onResultsHandler()}</p>
      <div class="layout__mnemonics__actions">
        <button class="btn btn-sm btn-cancel" on:click={closeResult}>Close</button>
      </div>
    </div>
  </div>
{/if}

<button on:click={open} class="btn btn-deploy" disabled={!active}>
  <img src="/assets/deploy.png" alt="deploy" title="Deploy" />
</button>

<button on:click={openResult} class="btn btn-results">
  <img src="/assets/results.png" alt="results" title="Results" />
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
    background-color: transparent;
    padding: 1.5rem;
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

    &-results {
      position: fixed;
      right: 12rem;
      bottom: 1.5rem;
      z-index: 1;
    }
    img {
      width: 60px;
      height: 60px;
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
