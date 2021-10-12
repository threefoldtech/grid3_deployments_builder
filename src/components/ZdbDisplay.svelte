<script lang="ts">
  import type { ZDB } from "../models";
  import codeStore from "../store/code.store";
  import Collapse from "./Collapse.svelte";
  import Editable from "./Editable.svelte";
  import Selectable from "./Selectable.svelte";
  import { DeviceTypes, ZdbModes } from "grid3_client_ts";

  export let resourceIdx: number;
  export let idx: number;
  export let zdb: ZDB;

  let collapse = false;
</script>

<div>
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/zdbs.png" alt="deployment icon" width="40" />
    <span class="keyword">zdbs</span>
    {#if collapse}
      <p>...</p>
    {/if}
  </div>

  {#if !collapse}
    <Editable
      label="Name"
      value={zdb.name}
      on:input={codeStore.updateZdb(resourceIdx, idx, "name")}
    />
    <Editable
      label="Node"
      value={zdb.node}
      type="number"
      on:input={codeStore.updateZdb(resourceIdx, idx, "node")}
    />
    <Editable
      label="Size"
      value={zdb.size}
      type="number"
      on:input={codeStore.updateZdb(resourceIdx, idx, "size")}
    />
    <Selectable
      label="Type"
      options= {[DeviceTypes.hdd, DeviceTypes.ssd]}
      on:change={codeStore.updateZdb(resourceIdx, idx, "diskType")}
    />
    <Editable
      label="password"
      type="password"
      value={zdb.password}
      on:input={codeStore.updateZdb(resourceIdx, idx, "password")}
    />
    <Selectable
      label="mode"
      options={[ZdbModes.seq, ZdbModes.user]}
      on:change={codeStore.updateZdb(resourceIdx, idx, "mode")}
    />
    <Editable label="Public IP">
      <input
        type="checkbox"
        checked={zdb.publicIp}
        on:change={codeStore.updateZdb(resourceIdx, idx, "publicIp")}
      />
    </Editable>
  {/if}
</div>
