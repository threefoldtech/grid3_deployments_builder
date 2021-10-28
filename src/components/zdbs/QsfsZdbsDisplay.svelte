<script lang="ts">
  import type { QsfsZDBs } from "../../models";
  import codeStore from "../../store/code.store";
  import Collapse from "../base/Collapse.svelte";
  import Editable from "../base/Editable.svelte";

  export let qsfsZdbs: QsfsZDBs;
  export let idx: number;

  let collapse = false;
</script>

<div class="qsfsZdbs">
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/qsfsZdbs.png" alt="qsfs zdbs icon" width="40" />
    <span class="keyword">QSFS Zdbs Deployment</span>
    {#if collapse}
      <p>...</p>
    {:else if qsfsZdbs.isDeployed}
      <img src="/assets/deployed.png" alt="deployed icon" width="20" />
    {:else}
      <img src="/assets/notdeployed.png" alt="not deployed icon" width="20" />
    {/if}
  </div>
  {#if collapse}
    <br />
  {:else}
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
