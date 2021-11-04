<script lang="ts">
  import type { ZDB } from "../../models";
  import codeStore from "../../store/code.store";
  import Collapse from "../base/Collapse.svelte";
  import Editable from "../base/Editable.svelte";
  import Selectable from "../base/Selectable.svelte";
  import { ZdbModes } from "grid3_client";

  export let resourceIdx: number;
  export let idx: number;
  export let zdb: ZDB;

  let collapse = false;
</script>

<div>
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/zdb.png" alt="deployment icon" width="40" />
    <span class="keyword">Zdb</span>
    {#if collapse}
      <p>...</p>
    {/if}
    {#if zdb.isDeployed }
      <img src="/assets/deployed.png" alt="deployed icon" width="20"/>
      {:else}
      <img src="/assets/notdeployed.png" alt="not deployed icon" width="20"/>
      {/if}
  </div>

  {#if !collapse}
    <Editable
      label="Name"
      value={zdb.name}
      placeholder="Zdb name"
      on:input={codeStore.updateZdb(resourceIdx, idx, "name")}
      deployed = {zdb.isDeployed}
    />
    <Editable
      label="Node"
      value={zdb.node}
      type="number"
      on:input={codeStore.updateZdb(resourceIdx, idx, "node")}
      deployed = {zdb.isDeployed}
    />
    <Editable
      label="Size"
      value={zdb.size}
      type="number"
      on:input={codeStore.updateZdb(resourceIdx, idx, "size")}
      deployed = {zdb.isDeployed}
    />
    <Editable
      label="password"
      type="password"
      value={zdb.password}
      placeholder="Enter your zdb password"
      on:input={codeStore.updateZdb(resourceIdx, idx, "password")}
      deployed = {zdb.isDeployed}
    />
    <Selectable
      label="mode"
      options={[ZdbModes.seq, ZdbModes.user]}
      on:change={codeStore.updateZdb(resourceIdx, idx, "mode")}
      deployed = {zdb.isDeployed}
    />
    <Editable label="Public IP" deployed = {zdb.isDeployed}>
      <input
        type="checkbox"
        checked={zdb.publicIp}
        on:change={codeStore.updateZdb(resourceIdx, idx, "publicIp")}
        disabled = {zdb.isDeployed}
      />
    </Editable>
  {/if}
</div>
