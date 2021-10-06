<script lang="ts">
  import type { ZDB } from "../models";
  import codeStore from "../store/code.store";
  import Collapse from "./Collapse.svelte";
  import Editable from "./Editable.svelte";

  export let idx: number;
  export let zdb: ZDB;

  let collapse = false;
</script>

<div>
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/disk.svg" alt="deployment icon" width="40" />
    <span class="keyword">zdbs</span>
    {#if collapse}
      <p>...</p>
    {/if}
  </div>

  {#if !collapse}
    <Editable
      label="name"
      value={zdb.name}
      on:input={codeStore.updateZdb(idx, "name")}
    />
    <Editable
      label="size"
      value={zdb.size}
      type="number"
      on:input={codeStore.updateZdb(idx, "size")}
    />
    <Editable
      label="description"
      value={zdb.description}
      on:input={codeStore.updateZdb(idx, "description")}
    />
    <Editable
      label="password"
      value={zdb.password}
      on:input={codeStore.updateZdb(idx, "password")}
    />
    <Editable
      label="mode"
      value={zdb.mode}
      on:input={codeStore.updateZdb(idx, "mode")}
    />
  {/if}
</div>
