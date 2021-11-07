<script lang="ts">
  import { getClient, getZdbs } from "src/grid3";

  import mnemonicsStore from "src/store/mnemonics.store";
  import { addSuccessToast } from "src/store/toast.store";

  import type { ZDBs } from "../../models";
  import codeStore from "../../store/code.store";
  import Collapse from "../base/Collapse.svelte";
  import ConfirmMsg from "../base/ConfirmMsg.svelte";
  import Editable from "../base/Editable.svelte";

  export let zdbs: ZDBs;
  export let idx: number;

  $: store = $codeStore;
  $: mnemStore = $mnemonicsStore;

  let result = "";
  let showResult = false;

  const openResult = async () => {
    result = "";
    const project = store.projects[store.active];
    const gridClient = await getClient(mnemStore, project.name);
    getZdbs(gridClient, zdbs.name).then((res) => {
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

<div class="zdbs">
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/zdbs.png" alt="zdbs icon" width="40" />
    <span class="keyword">Zdbs Deployment</span>
    {#if collapse}
      <p>...</p>
    {:else if zdbs.isDeployed}
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
      value={zdbs.name}
      placeholder="Deployment name"
      on:input={codeStore.updateResource("name", idx)}
      deployed={zdbs.isDeployed}
    />
    <Editable
      label="Description"
      value={zdbs.description}
      type="text"
      placeholder="Describe your deployment"
      on:input={codeStore.updateResource("description", idx)}
      deployed={zdbs.isDeployed}
    />
    <Editable
      label="Metadata"
      value={zdbs.metadata}
      type="text"
      placeholder="Add info about your deployment"
      on:input={codeStore.updateResource("metadata", idx)}
      deployed={zdbs.isDeployed}
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
