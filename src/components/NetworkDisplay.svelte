<script lang="ts">
  import type { Network } from "../models";
  import codeStore from "../store/code.store";
  import Collapse from "./base/Collapse.svelte";
  import Editable from "./base/Editable.svelte";

  export let network: Network;

  let collapse = false;
</script>

<div>
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/network.png" alt="deployment icon" width="40" />
    <span class="keyword">Network</span>
    {#if collapse}
      <p>...</p>
    {/if}
  </div>

  {#if !collapse}
    <Editable
      label="Name"
      value={network.name}
      on:input={codeStore.updateNetwork("name")}
    />
    <Editable
      label="IP Range"
      value={network.ipRange}
      on:input={codeStore.updateNetwork("ipRange")}
    />
  {/if}
</div>
