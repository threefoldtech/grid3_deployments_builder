<script lang="ts">
  import type { Master, Project } from "../../models";
  import codeStore from "../../store/code.store";
  import CheckBox from "../base/CheckBox.svelte";
  import Collapse from "../base/Collapse.svelte";
  import Editable from "../base/Editable.svelte";
  import Node from "../base/Node.svelte";

  export let project: Project
  export let resourceIdx: number;
  export let idx: number;
  export let master: Master;

  let collapse = false;
</script>

<div>
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/kubernetes_master.png" alt="deployment icon" width="40" />
    <span class="keyword">Master</span>
    {#if collapse}
      <p>...</p>
    {/if}
    {#if master.isDeployed}
      <img src="/assets/verfied.png" alt="deployed icon" width="20" />
    {:else}
      <img src="/assets/unpublished.png" alt="not deployed icon" width="20" />
    {/if}
  </div>

  {#if !collapse}
    <Editable
      label="Name"
      value={master.name}
      placeholder="Master name"
      on:input={codeStore.updateKubeNode(resourceIdx, idx, "name")}
      deployed={master.isDeployed}
    />
    <Editable
    label="CPU"
      value={master.cpu}
      type="number"
      unit="Core"
      on:input={codeStore.updateKubeNode(resourceIdx, idx, "cpu")}
      deployed={master.isDeployed}
      />
      <Editable
      label="Memory"
      value={master.memory}
      type="number"
      unit="MB"
      on:input={codeStore.updateKubeNode(resourceIdx, idx, "memory")}
      deployed={master.isDeployed}
      />
      <Editable
      label="Root FS Size"
      value={master.rootFsSize}
      type="number"
      unit="GB"
      on:input={codeStore.updateKubeNode(resourceIdx, idx, "rootFsSize")}
      deployed={master.isDeployed}
    />
    <Editable
    label="Disk Size"
    type="number"
    value={master.diskSize}
    unit="GB"
    on:input={codeStore.updateKubeNode(resourceIdx, idx, "diskSize")}
    deployed={master.isDeployed}
    />
    <CheckBox
    label="Public IP"
    deployed={master.isDeployed}
    checked={master.publicIp}
    color={"--master"}
    on:change={codeStore.updateKubeNode(resourceIdx, idx, "publicIp")}
    />
    <CheckBox 
    label="Planetary" 
    deployed={master.isDeployed}
    checked={master.planetary}
    color={"--master"}
    on:change={codeStore.updateKubeNode(resourceIdx, idx, "planetary")}
    />
    <!-- <Node
      nodes={[]}
      lastSelected={master.node}
      on:change={codeStore.updateKubeNode(resourceIdx, idx, "node")}
      deployed={master.isDeployed}
    /> -->
  {/if}
</div>
