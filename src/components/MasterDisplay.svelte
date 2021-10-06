<script lang="ts">
  import type { Master } from "../models";
  import codeStore from "../store/code.store";
  import Collapse from "./Collapse.svelte";
  import Editable from "./Editable.svelte";

  export let resourceIdx: number;
  export let idx: number;
  export let master: Master;

  let collapse = false;
</script>

<div>
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/disk.svg" alt="deployment icon" width="40" />
    <span class="keyword">master</span>
    {#if collapse}
      <p>...</p>
    {/if}
  </div>

  {#if !collapse}
    <Editable
      label="Disk Size"
      value={master.diskSize}
      on:input={codeStore.updateMaster(resourceIdx, idx, "diskSize")}
    />
    <Editable
      label="node"
      value={master.node}
      type="number"
      on:input={codeStore.updateMaster(resourceIdx, idx, "node")}
    />
    <Editable
      label="name"
      value={master.name}
      on:input={codeStore.updateMaster(resourceIdx, idx, "name")}
    />
    <Editable
      label="cpu"
      value={master.cpu}
      type="number"
      on:input={codeStore.updateMaster(resourceIdx, idx, "cpu")}
    />

    <Editable label="publicip">
      <input
        type="checkbox"
        checked={master.publicip}
        on:change={codeStore.updateMaster(resourceIdx, idx, "publicip")}
      />
    </Editable>

    <Editable
      label="memory"
      value={master.memory}
      type="number"
      on:input={codeStore.updateMaster(resourceIdx, idx, "memory")}
    />
  {/if}
</div>
