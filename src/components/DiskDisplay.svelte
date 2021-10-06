<script lang="ts">
  import type { Disk } from "../models/disk";
  import codeStore from "../store/code.store";
  import Collapse from "./Collapse.svelte";
  import Editable from "./Editable.svelte";

  export let resourceIdx: number;
  export let idx: number;
  export let disk: Disk;

  let collapse = false;
</script>

<div>
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/disk.svg" alt="deployment icon" width="40" />
    <span class="keyword">disks</span>
    {#if collapse}
      <p>...</p>
    {/if}
  </div>

  {#if !collapse}
    <Editable
      label="name"
      value={disk.name}
      on:input={codeStore.updateDisk(resourceIdx, idx, "name")}
    />
    <Editable
      label="size"
      value={disk.size}
      type="number"
      on:input={codeStore.updateDisk(resourceIdx, idx, "size")}
    />
    <Editable
      label="description"
      value={disk.description}
      on:input={codeStore.updateDisk(resourceIdx, idx, "description")}
    />
  {/if}
</div>
