<script lang="ts">
  import codeStore from "../store/code.store";
  import mnemonicsStore from "../store/mnemonics.store";
  import Toasts from "../components/base/Toasts.svelte";
  import ConfirmMsg from "./base/ConfirmMsg.svelte";
  import { addSuccessToast } from "../store/toast.store";
  import {
    getClient,
    handleKubernetes,
    handleVMs,
    handleZDBs,
    getNetworkModel,
    getProjectResult,
    deployQsfsZdb,
  } from "src/grid3/index";
import { QsfsZDBs } from "src/models";

  $: store = $codeStore;
  $: active = store.active > -1;

  let showDeploy = false;
  let showResult = false;
  let projectResult = "";

  const open = () => (showDeploy = true);
  const close = () => (showDeploy = false);

  const openResult = () => {
    onResultsHandler()
    showResult = true;
  };
  const closeResult = () => (showResult = false);

  $: mnemStore = $mnemonicsStore;
  $: disabled = mnemStore.mnemonics.length === 0; // prettier-ignore

  async function onDeployHandler() {
    close();
    const project = store.projects[store.active];
    const network = getNetworkModel(project);
    const gridClient = await getClient(mnemStore, project.name);
    for (let [i, resource] of project.resources.entries()) {
      if (resource.type === "qsfsZdbs"){
        await deployQsfsZdb(resource as QsfsZDBs, i, gridClient)
      } else if (resource.type === "machines") {
        await handleVMs(network, resource, i, gridClient);
      } else if (resource.type === "kubernetes") {
        await handleKubernetes(network, resource, i, gridClient);
      } else if (resource.type === "zdbs") {
        await handleZDBs(resource, i, gridClient);
      } else if (resource.type === "fqdn" || resource.type === "name") {
        console.log(resource);
      }
    }
  }

  async function onResultsHandler() {
    projectResult = ""
    const project = store.projects[store.active];
    const gridClient = await getClient(mnemStore, project.name);
    getProjectResult(gridClient, project).then((res) => {
      projectResult = JSON.stringify(res, undefined, 2)
    });
  }

  function copyResult() {
    navigator.clipboard.writeText(projectResult);
    addSuccessToast("Result copied to clipboard")
    closeResult();
  }
</script>

<Toasts />

{#if showDeploy}
  <ConfirmMsg
    msg={"You are about to deploy " + store.projects[store.active].name}
    onClickConfirm={onDeployHandler}
    onClickCancel={close}
    {disabled}
  />
{/if}

{#if showResult}
  <ConfirmMsg
    msg={projectResult}
    onClickConfirm={copyResult}
    confirmBtnDisplayText={"Copy"}
    onClickCancel={closeResult}
    cancelBtnDisplayText={"Close"}
    disabled={projectResult === ""}
  />
{/if}

<button on:click={open} class="btn btn-deploy" disabled={!active}>
  <img src="/assets/deploy.png" alt="deploy" title="Deploy" />
</button>

<button on:click={openResult} class="btn btn-results">
  <img src="/assets/results.png" alt="results" title="Results" />
</button>

<style lang="scss" scoped>
  .btn {
    border: none;
    border-radius: 0.5rem;
    background-color: transparent;
    padding: 1.5rem;
    font-weight: bold;
    cursor: pointer;
    font-size: 1.6rem;
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
  }
</style>
