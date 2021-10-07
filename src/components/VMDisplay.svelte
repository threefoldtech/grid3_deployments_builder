<script lang="ts">
  import type { VM } from "../models/vm";
  import codeStore from "../store/code.store";
  import Collapse from "./Collapse.svelte";
  import Editable from "./Editable.svelte";

  export let resourceIdx: number;
  export let idx: number;
  export let vm: VM;

  let collapse = false;
</script>

<div>
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/vm.svg" alt="deployment icon" width="40" />
    <span class="keyword">vms</span>
    {#if collapse}
      <p>...</p>
    {/if}
  </div>

  {#if collapse}
    <br />
  {:else}
    <Editable
      label="name"
      value={vm.name}
      on:input={codeStore.updateVm(resourceIdx, idx, "name")}
    />
    <Editable
      label="flist"
      value={vm.flist}
      on:input={codeStore.updateVm(resourceIdx, idx, "flist")}
    />
    <Editable
      label="cpu"
      value={vm.cpu}
      type="number"
      on:input={codeStore.updateVm(resourceIdx, idx, "cpu")}
    />
    <Editable
      label="memory"
      value={vm.memory}
      type="number"
      on:input={codeStore.updateVm(resourceIdx, idx, "memory")}
    />
    <Editable
      label="entrypoint"
      value={vm.entrypoint}
      on:input={codeStore.updateVm(resourceIdx, idx, "entrypoint")}
    />
    <Editable label="Public Ip">
      <input
        type="checkbox"
        checked={vm.publicIp}
        on:change={codeStore.updateVm(resourceIdx, idx, "publicIp")}
      />
    </Editable>
  {/if}
</div>
