<script lang="ts">
  import type { Machine } from "../../models";
  import codeStore from "../../store/code.store";
  import Collapse from "../base/Collapse.svelte";
  import Editable from "../base/Editable.svelte";

  export let resourceIdx: number;
  export let idx: number;
  export let vm: Machine;

  let collapse = false;
</script>

<div>
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/vm.png" alt="deployment icon" width="40" />
    <span class="keyword">machine</span>
    {#if collapse}
      <p>...</p>
    {/if}
    {#if vm.isDeployed }
      <img src="/assets/deployed.png" alt="deployed icon" width="20"/>
      {:else}
      <img src="/assets/notdeployed.png" alt="not deployed icon" width="20"/>
      {/if}
  </div>

  {#if collapse}
    <br />
  {:else}
    <Editable
      label="Name"
      value={vm.name}
      on:input={codeStore.updateVm(resourceIdx, idx, "name")}
      deployed = {vm.isDeployed}
    />
    <Editable
      label="Node"
      value={vm.node}
      type="number"
      on:input={codeStore.updateVm(resourceIdx, idx, "node")}
      deployed = {vm.isDeployed}
    />
    <Editable
      label="Flist"
      value={vm.flist}
      on:input={codeStore.updateVm(resourceIdx, idx, "flist")}
      deployed = {vm.isDeployed}
    />
    <Editable
      label="CPU"
      value={vm.cpu}
      type="number"
      on:input={codeStore.updateVm(resourceIdx, idx, "cpu")}
      deployed = {vm.isDeployed}
    />
    <Editable
      label="Memory"
      value={vm.memory}
      type="number"
      on:input={codeStore.updateVm(resourceIdx, idx, "memory")}
      deployed = {vm.isDeployed}
    />
    <Editable
      label="Root FS Size"
      value={vm.rootFsSize}
      type="number"
      on:input={codeStore.updateVm(resourceIdx, idx, "rootFsSize")}
      deployed = {vm.isDeployed}
    />
    <Editable
      label="Entrypoint"
      value={vm.entrypoint}
      on:input={codeStore.updateVm(resourceIdx, idx, "entrypoint")}
      deployed = {vm.isDeployed}
    />
    <Editable label="Public IP" deployed = {vm.isDeployed}>
      <input
        type="checkbox"
        checked={vm.publicIp}
        on:change={codeStore.updateVm(resourceIdx, idx, "publicIp")}
        disabled = {vm.isDeployed}
      />
    </Editable>
    <Editable label="Planetary" deployed = {vm.isDeployed}>
      <input
        type="checkbox"
        checked={vm.planetary}
        on:change={codeStore.updateVm(resourceIdx, idx, "planetary")}
        disabled = {vm.isDeployed}
      />
    </Editable>
  {/if}
</div>
