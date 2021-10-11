<script lang="ts">
  import type { Master } from "../models";
  import codeStore from "../store/code.store";
  import Collapse from "./Collapse.svelte";
  import Editable from "./Editable.svelte";

  export let resourceIdx: number;
  export let idx: number;
  export let master: Master;

  let collapse = false;
</script>

<div>
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/kubernetes_master.png" alt="deployment icon" width="40" />
    <span class="keyword">master</span>
    {#if collapse}
      <p>...</p>
    {/if}
  </div>

  {#if !collapse}
    <Editable
      label="Name"
      value={master.name}
      on:input={codeStore.updateMaster(resourceIdx, idx, "name")}
    />
    <Editable
      label="Node"
      value={master.node}
      type="number"
      on:input={codeStore.updateMaster(resourceIdx, idx, "node")}
    />
    <Editable
      label="CPU"
      value={master.cpu}
      type="number"
      on:input={codeStore.updateMaster(resourceIdx, idx, "cpu")}
    />
    <Editable
      label="Memory"
      value={master.memory}
      type="number"
      on:input={codeStore.updateMaster(resourceIdx, idx, "memory")}
    />
    <Editable
      label="Root FS Size"
      value={master.rootFsSize}
      type="number"
      on:input={codeStore.updateMaster(resourceIdx, idx, "rootFsSize")}
    />
    <Editable
      label="Disk Size"
      type="number"
      value={master.diskSize}
      on:input={codeStore.updateMaster(resourceIdx, idx, "diskSize")}
    />
    <Editable label="Public IP">
      <input
        type="checkbox"
        checked={master.publicIp}
        on:change={codeStore.updateMaster(resourceIdx, idx, "publicIp")}
      />
    </Editable>
    <Editable label="Planetary">
      <input
        type="checkbox"
        checked={master.planetary}
        on:change={codeStore.updateMaster(resourceIdx, idx, "planetary")}
      />
    </Editable>
  {/if}
</div>
