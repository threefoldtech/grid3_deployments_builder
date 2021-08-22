<script lang="ts">
  import type { Disk } from "../store/code.store";
  import Editable from "./Editable.svelte";

  export let disk: Disk;
</script>

<div>
  <span class="keyword">disks</span>

  <Editable label="name" value={disk.name} />
  <Editable label="size" value={disk.size} type="number" />
  <Editable label="description" value={disk.description} />
</div>
