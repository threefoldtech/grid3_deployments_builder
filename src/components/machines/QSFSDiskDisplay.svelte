<script lang="ts">
  import type { QsfsDisk } from "../../models";
  import codeStore from "../../store/code.store";
  import Collapse from "../base/Collapse.svelte";
  import Editable from "../base/Editable.svelte";

  export let resourceIdx: number;
  export let elementIdx: number;
  export let idx: number;
  export let qsfsDisk: QsfsDisk;

  let collapse = false;
</script>

<div>
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/diskQsfs.png" alt="deployment icon" width="40" />
    <span class="keyword">QSFS Disk</span>
    {#if collapse}
      <p>...</p>
    {/if}
    {#if qsfsDisk.isDeployed}
      <img src="/assets/verfied.png" alt="deployed icon" width="20" />
    {:else}
      <img src="/assets/unpublished.png" alt="not deployed icon" width="20" />
    {/if}
  </div>

  {#if !collapse}
    <Editable
      label="name"
      value={qsfsDisk.name}
      placeholder="Qsfs Disk name"
      on:input={codeStore.updateQsfsDisk(resourceIdx, elementIdx, idx, "name")}
      deployed={qsfsDisk.isDeployed}
    />
    <Editable
      label="Qsfs Zdbs name"
      value={qsfsDisk.qsfsZdbsName}
      placeholder="Qsfs Zdbs deployment name, if you don't have one, deploy QSFS Zdbs first"
      on:input={codeStore.updateQsfsDisk(
        resourceIdx,
        elementIdx,
        idx,
        "qsfsZdbsName"
      )}
      deployed={qsfsDisk.isDeployed}
    />
    <Editable
      label="Prefix"
      value={qsfsDisk.prefix}
      placeholder="Enter a prefix"
      on:input={codeStore.updateQsfsDisk(resourceIdx, elementIdx, idx, "prefix")}
      deployed={qsfsDisk.isDeployed}
    />
    <Editable
      label="Encryption Key"
      value={qsfsDisk.encryptionKey}
      type="password"
      placeholder="Enter your encryption key"
      on:input={codeStore.updateQsfsDisk(
        resourceIdx,
        elementIdx,
        idx,
        "encryptionKey"
      )}
      deployed={qsfsDisk.isDeployed}
    />
    <Editable
      label="Cache"
      value={qsfsDisk.cache}
      type="number"
      unit="GB"
      on:input={codeStore.updateQsfsDisk(resourceIdx, elementIdx, idx, "cache")}
      deployed={qsfsDisk.isDeployed}
    />
    <Editable
      label="Minimal Shards"
      value={qsfsDisk.minimalShards}
      type="number"
      unit="Zdb"
      on:input={codeStore.updateQsfsDisk(
        resourceIdx,
        elementIdx,
        idx,
        "minimalShards"
      )}
      deployed={qsfsDisk.isDeployed}
    />
    <Editable
      label="Expected Shards"
      value={qsfsDisk.expectedShards}
      type="number"
      unit="Zdb"
      min={qsfsDisk.minimalShards + 1}
      on:input={codeStore.updateQsfsDisk(
        resourceIdx,
        elementIdx,
        idx,
        "expectedShards"
      )}
      deployed={qsfsDisk.isDeployed}
    />
    <Editable
      label="Mountpoint"
      value={qsfsDisk.mountpoint}
      placeholder="Mount point"
      on:input={codeStore.updateQsfsDisk(resourceIdx, elementIdx, idx, "mountpoint")}
      deployed={qsfsDisk.isDeployed}
    />
  {/if}
</div>
