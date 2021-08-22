<script lang="ts">
  import type { Mount } from "../store/code.store";
  import codeStore from "../store/code.store";
  import Editable from "./Editable.svelte";

  export let vmIdx: number;
  export let idx: number;
  export let mount: Mount;
</script>

<div>
  <span class="keyword">mounts</span>

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
</div>
