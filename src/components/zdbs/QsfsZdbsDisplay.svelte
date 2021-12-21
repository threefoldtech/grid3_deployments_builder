<script lang="ts">
  import { getClient, getQsfsZdbs } from "src/grid3";

  import mnemonicsStore from "src/store/mnemonics.store";
  import { addSuccessNotification } from "src/store/notification.store";

  import type { Project, QsfsZDBs } from "../../models";
  import codeStore from "../../store/code.store";
  import Collapse from "../base/Collapse.svelte";
  import ConfirmMsg from "../base/ConfirmMsg.svelte";
  import Editable from "../base/Editable.svelte";

  export let project: Project;
  export let qsfsZdbs: QsfsZDBs;
  export let idx: number;

  $: store = $codeStore;
  $: mnemStore = $mnemonicsStore;

  let result = "";
  let showResult = false;

  const openResult = async () => {
    result = "";
    const project = store.projects[store.active];
    const gridClient = await getClient(mnemStore, project.name);
    getQsfsZdbs(gridClient, qsfsZdbs.name).then((res) => {
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

<div class="qsfsZdbs">
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/storageQsfsd.png" alt="qsfs zdbs icon" width="40" />
    <span class="keyword">QSFS Zdbs Deployment</span>
    {#if collapse}
      <p>...</p>
    {:else if qsfsZdbs.isDeployed}
      <img src="/assets/verfied.png" alt="deployed icon" width="20" />
      <button class="btn_result">
        <img src="/assets/info.png" alt="Result" on:click={openResult} />
      </button>
    {:else}
      <img src="/assets/unpublished.png" alt="not deployed icon" width="20" />
    {/if}
  </div>
  {#if !collapse}
    <Editable
      label="Name"
      value={qsfsZdbs.name}
      placeholder="Deployment name"
      on:input={codeStore.updateQsfsZdbs("name", idx)}
      deployed={qsfsZdbs.isDeployed}
    />
    <Editable
      label="Count"
      type="number"
      unit="Zdb"
      value={qsfsZdbs.count}
      min={3}
      on:input={codeStore.updateQsfsZdbs("count", idx)}
    />
    <Editable
      label="Node Ids"
      value={qsfsZdbs.nodeIds.join(", ")}
      placeholder="Choose nodes you want to deploy QSFS Zdbs on"
      on:input={codeStore.updateQsfsZdbs("nodeIds", idx)}
      deployed={qsfsZdbs.isDeployed}
    />
    <Editable
      label="Disk Size"
      type="number"
      unit="GB"
      value={qsfsZdbs.diskSize}
      on:input={codeStore.updateQsfsZdbs("diskSize", idx)}
    />
    <Editable
      label="Password"
      value={qsfsZdbs.password}
      placeholder="Enter you QSFS Zdbs password, don't forget it!"
      type="password"
      on:input={codeStore.updateQsfsZdbs("password", idx)}
      deployed={qsfsZdbs.isDeployed}
    />
    <Editable
      label="Description"
      value={qsfsZdbs.description}
      type="text"
      placeholder="Describe your deployment"
      on:input={codeStore.updateQsfsZdbs("description", idx)}
      deployed={qsfsZdbs.isDeployed}
    />
    <Editable
      label="Metadata"
      value={qsfsZdbs.metadata}
      type="text"
      placeholder="Add info about your deployment"
      on:input={codeStore.updateQsfsZdbs("metadata", idx)}
      deployed={qsfsZdbs.isDeployed}
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
