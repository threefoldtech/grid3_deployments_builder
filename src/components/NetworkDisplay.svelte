<script lang="ts">
  import type { Network } from "../models";
  import codeStore from "../store/code.store";
  import Collapse from "./Collapse.svelte";
  import Editable from "./Editable.svelte";

  export let network: Network;

  let collapse = false;
</script>

<div>
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/disk.svg" alt="deployment icon" width="40" />
    <span class="keyword">network</span>
    {#if collapse}
      <p>...</p>
    {/if}
  </div>

  {#if !collapse}
    <Editable
      label="name"
      value={network.name}
      on:input={codeStore.updateNetwork("name")}
    />
    <Editable
      label="nodes"
      value={network.node.join(", ")}
      on:input={codeStore.updateNetwork("node")}
    />
    <Editable
      label="IP Range"
      value={network.ipRange}
      on:input={codeStore.updateNetwork("ipRange")}
    />
    <Editable
      label="description"
      value={network.description}
      on:input={codeStore.updateNetwork("description")}
    />
  {/if}
</div>
