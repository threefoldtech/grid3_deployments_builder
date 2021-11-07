<script lang="ts">
  import { getClient, getMachines } from "src/grid3";
  import mnemonicsStore from "src/store/mnemonics.store";
  import { addSuccessToast } from "src/store/toast.store";

  import type { Machines } from "../../models";
  import codeStore from "../../store/code.store";
  import Collapse from "../base/Collapse.svelte";
  import ConfirmMsg from "../base/ConfirmMsg.svelte";
  import Editable from "../base/Editable.svelte";

  export let machines: Machines;
  export let idx: number;

  $: store = $codeStore;
  $: mnemStore = $mnemonicsStore;

  let result = "";
  let showResult = false;

  const openResult = async () => {
    result = "";
    const project = store.projects[store.active];
    const gridClient = await getClient(mnemStore, project.name);
    getMachines(gridClient, machines.name).then((res) => {
      result = JSON.stringify(res, undefined, 2);
    });
    showResult = true;
  };

  const closeResult = () => (showResult = false);

  function copy() {
    navigator.clipboard.writeText(result);
    addSuccessToast("Result copied to clipboard");
    closeResult();
  }
  let collapse = false;
</script>

<div class="resource">
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/vms.png" alt="deployment icon" width="40" />
    <span class="keyword">Machines Deployment</span>
    {#if collapse}
      <p>...</p>
    {:else if machines.isDeployed}
      <img src="/assets/deployed.png" alt="deployed icon" width="20" />
      <button class="btn_result">
        <img src="/assets/info.png" alt="Result" on:click={openResult} />
      </button>
    {:else}
      <img src="/assets/notdeployed.png" alt="not deployed icon" width="20" />
    {/if}
  </div>
  {#if collapse}
    <br />
  {:else}
    <Editable
      label="Name"
      value={machines.name}
      placeholder="Deployment name"
      on:input={codeStore.updateResource("name", idx)}
      deployed={machines.isDeployed}
    />
    <Editable
      label="Description"
      value={machines.description}
      placeholder="Describe your deployment"
      on:input={codeStore.updateResource("description", idx)}
      deployed={machines.isDeployed}
    />
    <Editable
      label="Metadata"
      value={machines.metadata}
      placeholder="Add info about your deployment"
      on:input={codeStore.updateResource("metadata", idx)}
      deployed={machines.isDeployed}
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
