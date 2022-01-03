<script lang="ts">
  import type { Project, Worker } from "../../models";
  import codeStore from "../../store/code.store";
  import CheckBox from "../base/CheckBox.svelte";
  import Collapse from "../base/Collapse.svelte";
  import Editable from "../base/Editable.svelte";
  import Node from "../base/Node.svelte";

  export let project: Project;
  export let resourceIdx: number;
  export let idx: number;
  export let worker: Worker;

  let collapse = false;
</script>

<div>
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/kubernetes_worker.png" alt="worker icon" width="40" />
    <span class="keyword">Worker</span>
    {#if collapse}
      <p>...</p>
    {/if}
    {#if worker.isDeployed}
      <img src="/assets/verfied.png" alt="deployed icon" width="20" />
    {:else}
      <img src="/assets/unpublished.png" alt="not deployed icon" width="20" />
    {/if}
  </div>

  {#if !collapse}
    <Editable
      label="Name"
      value={worker.name}
      placeholder="Worker name"
      on:input={codeStore.updateKubeNode(resourceIdx, idx, "name")}
      deployed={worker.isDeployed}
    />
    <Editable
      label="CPU"
      value={worker.cpu}
      type="number"
      unit="Core"
      on:input={codeStore.updateKubeNode(resourceIdx, idx, "cpu")}
      deployed={worker.isDeployed}
    />
    <Editable
      label="Memory"
      value={worker.memory}
      type="number"
      unit="MB"
      on:input={codeStore.updateKubeNode(resourceIdx, idx, "memory")}
      deployed={worker.isDeployed}
    />
    <Editable
      label="Root FS Size"
      value={worker.rootFsSize}
      type="number"
      unit="GB"
      on:input={codeStore.updateKubeNode(resourceIdx, idx, "rootFsSize")}
      deployed={worker.isDeployed}
    />
    <Editable
      label="Disk Size"
      type="number"
      value={worker.diskSize}
      unit="GB"
      on:input={codeStore.updateKubeNode(resourceIdx, idx, "diskSize")}
      deployed={worker.isDeployed}
    />
    <CheckBox
      label="Public IP"
      deployed={worker.isDeployed}
      checked={worker.publicIp}
      color={"--worker"}
      on:change={codeStore.updateKubeNode(resourceIdx, idx, "publicIp")}
    />
    <CheckBox
      label="Planetary"
      deployed={worker.isDeployed}
      checked={worker.planetary}
      color={"--worker"}
      on:change={codeStore.updateKubeNode(resourceIdx, idx, "planetary")}
    />
    {#if project.gridClient}
      <Node
        {project}
        lastSelectedValue={worker.node}
        on:select={codeStore.updateKubeNode(resourceIdx, idx, "node")}
        deployed={worker.isDeployed}
        resources={{
          cru: worker.cpu,
          mru: worker.memory,
          sru: worker.diskSize + worker.rootFsSize,
          publicIPs: worker.publicIp,
          hru: 0,
          gateway: false,
        }}
      />
    {:else}
      <p style="font-size:1.8rem">loading..</p>
    {/if}
  {/if}
</div>
