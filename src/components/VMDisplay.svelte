<script lang="ts">
  import type { VM } from "../store/code.store";
  import Editable from "./Editable.svelte";

  export let vm: VM;
</script>

<div>
  <span class="keyword">vms</span>

  <Editable label="name" value={vm.name} />
  <Editable label="flist" value={vm.flist} />
  <Editable label="cpu" value={vm.cpu} />
  <Editable label="memory" value={vm.memory} />
  <Editable label="entrypoint" value={vm.entrypoint} />
</div>
