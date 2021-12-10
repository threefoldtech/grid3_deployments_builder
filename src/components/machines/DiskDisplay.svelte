<script lang="ts">
  import type { Disk } from "../../models";
  import codeStore from "../../store/code.store";
  import Collapse from "../base/Collapse.svelte";
  import Editable from "../base/Editable.svelte";

  export let resourceIdx: number;
  export let vmIdx: number;
  export let idx: number;
  export let disk: Disk;

  let collapse = false;
</script>

<div>
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/disk.png" alt="deployment icon" width="40" />
    <span class="keyword">Disk</span>
    {#if collapse}
      <p>...</p>
    {/if}
    {#if disk.isDeployed}
      <img src="/assets/verfied.png" alt="deployed icon" width="20" />
    {:else}
      <img src="/assets/unpublished.png" alt="not deployed icon" width="20" />
    {/if}
  </div>

  {#if !collapse}
    <Editable
      label="name"
      value={disk.name}
      placeholder="Disk name"
      on:input={codeStore.updateDisk(resourceIdx, vmIdx, idx, "name")}
      deployed={disk.isDeployed}
    />
    <Editable
      label="size"
      value={disk.size}
      type="number"
      on:input={codeStore.updateDisk(resourceIdx, vmIdx, idx, "size")}
      deployed={disk.isDeployed}
    />
    <Editable
      label="mount"
      value={disk.mount}
      placeholder="Mount point"
      on:input={codeStore.updateDisk(resourceIdx, vmIdx, idx, "mount")}
      deployed={disk.isDeployed}
    />
    <Editable
      label="description"
      value={disk.description}
      placeholder="Describe your disk"
      on:input={codeStore.updateDisk(resourceIdx, vmIdx, idx, "description")}
      deployed={disk.isDeployed}
    />
  {/if}
</div>
