<script lang="ts">
  import type { Disk } from "../models/disk";
  import codeStore from "../store/code.store";
  import Collapse from "./Collapse.svelte";
  import Editable from "./Editable.svelte";

  export let resourceIdx: number;
  export let vmIdx: number;
  export let idx: number;
  export let disk: Disk;

  let collapse = false;
</script>

<div>
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/disk.svg" alt="deployment icon" width="40" />
    <span class="keyword">disk</span>
    {#if collapse}
      <p>...</p>
    {/if}
    {#if disk.isDeployed }
      <img src="/assets/deployed.png" alt="deployed icon" width="20"/>
      {:else}
      <img src="/assets/notdeployed.png" alt="not deployed icon" width="20"/>
      {/if}
  </div>

  {#if !collapse}
    <Editable
      label="name"
      value={disk.name}
      on:input={codeStore.updateDisk(resourceIdx, vmIdx, idx, "name")}
      deployed = {disk.isDeployed}
    />
    <Editable
      label="size"
      value={disk.size}
      type="number"
      on:input={codeStore.updateDisk(resourceIdx, vmIdx, idx, "size")}
      deployed = {disk.isDeployed}
    />
    <Editable
      label="mount"
      value={disk.mount}
      on:input={codeStore.updateDisk(resourceIdx, vmIdx, idx, "mount")}
      deployed = {disk.isDeployed}
    />
    <Editable
      label="description"
      value={disk.description}
      on:input={codeStore.updateDisk(resourceIdx, vmIdx, idx, "description")}
      deployed = {disk.isDeployed}
    />
  {/if}
</div>
