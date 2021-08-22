<script lang="ts">
  import type { VM } from "../store/code.store";
  import codeStore from "../store/code.store";
  import Editable from "./Editable.svelte";

  export let idx: number;
  export let vm: VM;
</script>

<div>
  <span class="keyword">vms</span>

  <Editable
    label="name"
    value={vm.name}
    on:input={codeStore.updateVm(idx, "name")}
  />
  <Editable
    label="flist"
    value={vm.flist}
    on:input={codeStore.updateVm(idx, "flist")}
  />
  <Editable
    label="cpu"
    value={vm.cpu}
    type="number"
    on:input={codeStore.updateVm(idx, "cpu")}
  />
  <Editable
    label="memory"
    value={vm.memory}
    type="number"
    on:input={codeStore.updateVm(idx, "memory")}
  />
  <Editable
    label="entrypoint"
    value={vm.entrypoint}
    on:input={codeStore.updateVm(idx, "entrypoint")}
  />
</div>
