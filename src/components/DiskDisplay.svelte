<script lang="ts">
  import type { Disk } from "../store/code.store";
  import codeStore from "../store/code.store";
  import Editable from "./Editable.svelte";

  export let idx: number;
  export let disk: Disk;
</script>

<div>
  <div class="header">
    <img src="/assets/disk.svg" alt="deployment icon" width="40" />
    <span class="keyword">disks</span>
  </div>

  <Editable
    label="name"
    value={disk.name}
    on:input={codeStore.updateDisk(idx, "name")}
  />
  <Editable
    label="size"
    value={disk.size}
    type="number"
    on:input={codeStore.updateDisk(idx, "size")}
  />
  <Editable
    label="description"
    value={disk.description}
    on:input={codeStore.updateDisk(idx, "description")}
  />
</div>
