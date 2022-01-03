<script lang="ts">
  import type { Machine, Project } from "../../models";
  import codeStore from "../../store/code.store";
  import Collapse from "../base/Collapse.svelte";
  import Editable from "../base/Editable.svelte";
  import CheckBox from "../base/CheckBox.svelte";
  import Node from "../base/Node.svelte";

  export let project: Project;
  export let resourceIdx: number;
  export let idx: number;
  export let vm: Machine;

  let collapse = false;
</script>

<div>
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/machine.png" alt="deployment icon" width="40" />
    <span class="keyword">Generic Machine</span>
    {#if collapse}
      <p>...</p>
    {/if}
    {#if vm.isDeployed}
      <img src="/assets/verfied.png" alt="deployed icon" width="20" />
    {:else}
      <img src="/assets/unpublished.png" alt="not deployed icon" width="20" />
    {/if}
  </div>

  {#if collapse}
    <br />
  {:else}
    <Editable
      label="Name"
      value={vm.name}
      placeholder="Machine name"
      on:input={codeStore.updateVm(resourceIdx, idx, "name")}
      deployed={vm.isDeployed}
    />
    <Editable
      label="Flist"
      value={vm.flist}
      on:input={codeStore.updateVm(resourceIdx, idx, "flist")}
      deployed={vm.isDeployed}
    />
    <Editable
      label="CPU"
      value={vm.cpu}
      type="number"
      unit="Core"
      on:input={codeStore.updateVm(resourceIdx, idx, "cpu")}
      deployed={vm.isDeployed}
    />
    <Editable
      label="Memory"
      value={vm.memory}
      type="number"
      unit="MB"
      on:input={codeStore.updateVm(resourceIdx, idx, "memory")}
      deployed={vm.isDeployed}
    />
    <Editable
      label="Root FS Size"
      value={vm.rootFsSize}
      type="number"
      unit="GB"
      on:input={codeStore.updateVm(resourceIdx, idx, "rootFsSize")}
      deployed={vm.isDeployed}
    />
    <Editable
      label="Entrypoint"
      value={vm.entrypoint}
      on:input={codeStore.updateVm(resourceIdx, idx, "entrypoint")}
      deployed={vm.isDeployed}
    />
    <CheckBox
      label="Public IP"
      deployed={vm.isDeployed}
      checked={vm.publicIp}
      color={"--machine"}
      on:change={codeStore.updateVm(resourceIdx, idx, "publicIp")}
    />
    <CheckBox
      label="Planetary"
      deployed={vm.isDeployed}
      checked={vm.planetary}
      color={"--machine"}
      on:change={codeStore.updateVm(resourceIdx, idx, "planetary")}
    />
    {#if project.gridClient}
      <Node
        {project}
        lastSelectedValue={vm.node}
        on:change={codeStore.updateVm(resourceIdx, idx, "node")}
        on:select={codeStore.updateVm(resourceIdx, idx, "node")}
        deployed={vm.isDeployed}
        resources={{
          cru: vm.cpu,
          mru: vm.memory,
          sru: vm.disks.reduce((sum, v) => sum + v.size, vm.rootFsSize),
          publicIPs: vm.publicIp,
          hru: 0,
          gateway: false,
        }}
      />
    {:else}
      <p style="font-size:1.8rem">loading..</p>
    {/if}
  {/if}
</div>
