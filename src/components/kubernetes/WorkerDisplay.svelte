<script lang="ts">
  import type { Worker } from "../../models";
  import codeStore from "../../store/code.store";
  import Collapse from "../base/Collapse.svelte";
  import Editable from "../base/Editable.svelte";

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
    {#if worker.isDeployed }
      <img src="/assets/deployed.png" alt="deployed icon" width="20"/>
      {:else}
      <img src="/assets/notdeployed.png" alt="not deployed icon" width="20"/>
      {/if}
  </div>

  {#if !collapse}
    <Editable
      label="Name"
      value={worker.name}
      on:input={codeStore.updateWorker(resourceIdx, idx, "name")}
      deployed = {worker.isDeployed}
    />
    <Editable
      label="Node"
      value={worker.node}
      type="number"
      on:input={codeStore.updateWorker(resourceIdx, idx, "node")}
      deployed = {worker.isDeployed}
    />
    <Editable
      label="CPU"
      value={worker.cpu}
      type="number"
      on:input={codeStore.updateWorker(resourceIdx, idx, "cpu")}
      deployed = {worker.isDeployed}
    />
    <Editable
      label="Memory"
      value={worker.memory}
      type="number"
      on:input={codeStore.updateWorker(resourceIdx, idx, "memory")}
      deployed = {worker.isDeployed}
    />
    <Editable
      label="Root FS Size"
      value={worker.rootFsSize}
      type="number"
      on:input={codeStore.updateWorker(resourceIdx, idx, "rootFsSize")}
      deployed = {worker.isDeployed}
    />
    <Editable
      label="Disk Size"
      type="number"
      value={worker.diskSize}
      on:input={codeStore.updateWorker(resourceIdx, idx, "diskSize")}
      deployed = {worker.isDeployed}
    />
    <Editable label="Public IP" deployed = {worker.isDeployed}>
      <input
        type="checkbox"
        checked={worker.publicIp}
        on:change={codeStore.updateWorker(resourceIdx, idx, "publicIp")}
        disabled = {worker.isDeployed}
      />
    </Editable>
    <Editable label="Planetary" deployed = {worker.isDeployed}>
      <input
        type="checkbox"
        checked={worker.planetary}
        on:change={codeStore.updateWorker(resourceIdx, idx, "planetary")}
        disabled = {worker.isDeployed}
      />
    </Editable>
  {/if}
</div>
