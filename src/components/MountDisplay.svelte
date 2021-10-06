<script lang="ts">
  import type { Mount } from "../models/mount";
  import codeStore from "../store/code.store";
  import Collapse from "./Collapse.svelte";
  import Editable from "./Editable.svelte";

  export let vmIdx: number;
  export let idx: number;
  export let mount: Mount;

  let collapse = false;
</script>

<div>
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/mount.svg" alt="deployment icon" width="40" />
    <span class="keyword">mounts</span>
    {#if collapse}
      <p>...</p>
    {/if}
  </div>

  {#if !collapse}
    <Editable
      label="disk_name"
      value={mount.disk_name}
      on:input={codeStore.updateMounts(vmIdx, idx, "disk_name")}
    />
    <Editable
      label="mount_point"
      value={mount.mount_point}
      on:input={codeStore.updateMounts(vmIdx, idx, "mount_point")}
    />
  {/if}
</div>
