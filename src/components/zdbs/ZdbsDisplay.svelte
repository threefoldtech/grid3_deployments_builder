<script lang="ts">
  import type { ZDBs } from "../../models";
  import codeStore from "../../store/code.store";
  import Collapse from "../base/Collapse.svelte";
  import Editable from "../base/Editable.svelte";

  export let zdbs: ZDBs;
  export let idx: number;

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
