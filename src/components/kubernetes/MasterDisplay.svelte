<script lang="ts">
  import type { Master } from "../../models";
  import codeStore from "../../store/code.store";
  import Collapse from "../base/Collapse.svelte";
  import Editable from "../base/Editable.svelte";

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
      <img src="/assets/deployed.png" alt="deployed icon" width="20" />
    {:else}
      <img src="/assets/notdeployed.png" alt="not deployed icon" width="20" />
    {/if}
  </div>

  {#if !collapse}
    <Editable
      label="Name"
      value={master.name}
      placeholder="Master name"
      on:input={codeStore.updateMaster(resourceIdx, idx, "name")}
      deployed={master.isDeployed}
    />
    <Editable
      label="Node"
      value={master.node}
      type="number"
      on:input={codeStore.updateMaster(resourceIdx, idx, "node")}
      deployed={master.isDeployed}
    />
    <Editable
      label="CPU"
      value={master.cpu}
      type="number"
      on:input={codeStore.updateMaster(resourceIdx, idx, "cpu")}
      deployed={master.isDeployed}
    />
    <Editable
      label="Memory"
      value={master.memory}
      type="number"
      on:input={codeStore.updateMaster(resourceIdx, idx, "memory")}
      deployed={master.isDeployed}
    />
    <Editable
      label="Root FS Size"
      value={master.rootFsSize}
      type="number"
      on:input={codeStore.updateMaster(resourceIdx, idx, "rootFsSize")}
      deployed={master.isDeployed}
    />
    <Editable
      label="Disk Size"
      type="number"
      value={master.diskSize}
      on:input={codeStore.updateMaster(resourceIdx, idx, "diskSize")}
      deployed={master.isDeployed}
    />
    <Editable label="Public IP" deployed={master.isDeployed}>
      <input
        type="checkbox"
        checked={master.publicIp}
        on:change={codeStore.updateMaster(resourceIdx, idx, "publicIp")}
        disabled={master.isDeployed}
      />
    </Editable>
    <Editable label="Planetary" deployed={master.isDeployed}>
      <input
        type="checkbox"
        checked={master.planetary}
        on:change={codeStore.updateMaster(resourceIdx, idx, "planetary")}
        disabled={master.isDeployed}
      />
    </Editable>
  {/if}
</div>
