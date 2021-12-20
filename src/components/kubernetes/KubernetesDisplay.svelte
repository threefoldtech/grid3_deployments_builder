<script lang="ts">
  import { getClient, getKubernetes } from "src/grid3";
  import mnemonicsStore from "src/store/mnemonics.store";
  import { addSuccessNotification } from "src/store/notification.store";

  import type { Kubernetes } from "../../models";
  import codeStore from "../../store/code.store";
  import Collapse from "../base/Collapse.svelte";
  import ConfirmMsg from "../base/ConfirmMsg.svelte";
  import Editable from "../base/Editable.svelte";

  export let kubernetes: Kubernetes;
  export let idx: number;

  $: store = $codeStore;
  $: mnemStore = $mnemonicsStore;

  let result = "";
  let showResult = false;

  const openResult = async () => {
    result = "";
    const project = store.projects[store.active];
    const gridClient = await getClient(mnemStore, project.name);
    getKubernetes(gridClient, kubernetes.name).then((res) => {
      result = JSON.stringify(res, undefined, 2);
      gridClient.disconnect();
    });
    showResult = true;
  };

  const closeResult = () => (showResult = false);

  function copy() {
    navigator.clipboard.writeText(result);
    addSuccessNotification("Result copied to clipboard");
    closeResult();
  }

  let collapse = false;
</script>

<div class="resource">
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/kubernetesd.png" alt="kubernetes icon" width="40" />
    <span class="keyword">Kubernetes Deployment</span>
    {#if collapse}
      <p>...</p>
    {:else if kubernetes.isDeployed}
      <img src="/assets/verfied.png" alt="deployed icon" width="20" />
      <button class="btn_result">
        <img src="/assets/info.png" alt="Result" on:click={openResult} />
      </button>
    {:else}
      <img src="/assets/unpublished.png" alt="not deployed icon" width="20" />
    {/if}
  </div>
  {#if collapse}
    <br />
  {:else}
    <Editable
      label="name"
      placeholder="Deployment name"
      value={kubernetes.name}
      on:input={codeStore.updateKubernetes("name", idx)}
      deployed={kubernetes.isDeployed}
    />
    <Editable
      label="Secret"
      value={kubernetes.secret}
      placeholder="Keep the secret in safe place"
      type="password"
      on:input={codeStore.updateKubernetes("secret", idx)}
      deployed={kubernetes.isDeployed}
    />
    <Editable
      label="SSH_KEY"
      value={kubernetes.sshKey}
      placeholder="Add ssh-key to access the cluster"
      on:input={codeStore.updateKubernetes("sshKey", idx)}
      deployed={kubernetes.isDeployed}
    />
    <Editable
      label="Description"
      value={kubernetes.description}
      placeholder="Describe your deployment"
      type="text"
      on:input={codeStore.updateKubernetes("description", idx)}
      deployed={kubernetes.isDeployed}
    />
    <Editable
      label="Metadata"
      value={kubernetes.metadata}
      type="text"
      placeholder="Add info about your deployment"
      on:input={codeStore.updateKubernetes("metadata", idx)}
      deployed={kubernetes.isDeployed}
    />
  {/if}
</div>

{#if showResult}
  <ConfirmMsg
    msg={result}
    onClickConfirm={copy}
    confirmBtnDisplayText={"Copy"}
    onClickCancel={closeResult}
    cancelBtnDisplayText={"Close"}
    disabled={result === ""}
  />
{/if}

<style lang="scss">
  .btn_result {
    background: none;
    border: none;
    cursor: pointer;
    padding-left: 1rem;

    img {
      width: 20px;
    }
  }
</style>
