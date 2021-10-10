<script lang="ts">
  import type { Worker } from "../models";
  import codeStore from "../store/code.store";
  import Collapse from "./Collapse.svelte";
  import Editable from "./Editable.svelte";

  export let resourceIdx: number;
  export let idx: number;
  export let worker: Worker;

  let collapse = false;
</script>

<div>
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/kubernetes.png" alt="deployment icon" width="40" />
    <span class="keyword">worker</span>
    {#if collapse}
      <p>...</p>
    {/if}
  </div>

  {#if !collapse}
    <Editable
      label="Disk Size"
      value={worker.diskSize}
      on:input={codeStore.updateWorker(resourceIdx, idx, "diskSize")}
    />
    <Editable
      label="node"
      value={worker.node}
      type="number"
      on:input={codeStore.updateWorker(resourceIdx, idx, "node")}
    />
    <Editable
      label="name"
      value={worker.name}
      on:input={codeStore.updateWorker(resourceIdx, idx, "name")}
    />
    <Editable
      label="cpu"
      value={worker.cpu}
      type="number"
      on:input={codeStore.updateWorker(resourceIdx, idx, "cpu")}
    />
    <Editable
      label="memory"
      value={worker.memory}
      type="number"
      on:input={codeStore.updateWorker(resourceIdx, idx, "memory")}
    />

    <Editable label="publicip">
      <input
        type="checkbox"
        checked={worker.publicIp}
        on:change={codeStore.updateWorker(resourceIdx, idx, "publicIp")}
      />
    </Editable>
  {/if}
</div>
