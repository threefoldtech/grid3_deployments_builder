<script lang="ts">
  import type { Resource } from "../models/resource";
  import codeStore from "../store/code.store";
  import Collapse from "./Collapse.svelte";
  import Editable from "./Editable.svelte";

  export let resource: Resource;
  export let idx: number;

  let collapse = false;
</script>

<div class="resource">
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/deployment.png" alt="deployment icon" width="40" />
    <span class="keyword">{resource.type}</span>
    {#if collapse}
      <p>...</p>
    {:else}
      <Editable
        value={resource.name}
        style="margin: 0 1.5rem;"
        on:input={codeStore.updateResource("name", idx)}
      />
      <Editable
        value={resource.title}
        on:input={codeStore.updateResource("title", idx)}
      />
    {/if}
  </div>
  {#if collapse}
    <br />
  {:else}
    <Editable
      label="node"
      value={resource.node}
      type="number"
      on:input={codeStore.updateResource("node", idx)}
    />
  {/if}
</div>
