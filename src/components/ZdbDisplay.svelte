<script lang="ts">
  import type { ZDB } from "../models";
  import codeStore from "../store/code.store";
  import Collapse from "./Collapse.svelte";
  import Editable from "./Editable.svelte";

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
      label="name"
      value={zdb.name}
      on:input={codeStore.updateZdb(resourceIdx, idx, "name")}
    />
    <Editable
      label="size"
      value={zdb.size}
      type="number"
      on:input={codeStore.updateZdb(resourceIdx, idx, "size")}
    />
    <!-- <Editable
      label="Type"
      value={zdb.diskType}
      on:input={codeStore.updateZdb(resourceIdx, idx, "diskType")}
    /> -->
    <Editable
      label="description"
      value={zdb.description}
      on:input={codeStore.updateZdb(resourceIdx, idx, "description")}
    />
    <Editable
      label="password"
      type="password"
      value={zdb.password}
      on:input={codeStore.updateZdb(resourceIdx, idx, "password")}
    />
    <Editable
      label="mode"
      value={zdb.mode}
      on:input={codeStore.updateZdb(resourceIdx, idx, "mode")}
    />
  {/if}
</div>
