<script lang="ts">
  import type { Mount } from "../store/code.store";
  import Editable from "./Editable.svelte";

  export let mount: Mount;
</script>

<div>
  <span class="keyword">mounts</span>

  <Editable label="disk_name" value={mount.disk_name} />
  <Editable label="mount_point" value={mount.mount_point} />
</div>
