<script lang="ts">
  import type { Env } from "../models/env";
  import codeStore from "../store/code.store";
  import Collapse from "./Collapse.svelte";
  import Editable from "./Editable.svelte";

  export let resourceIdx: number;
  export let vmIdx: number;
  export let idx: number;
  export let env: Env;

  let collapse = false;
</script>

<div>
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/key.svg" alt="deployment icon" width="40" />
    <span class="keyword">env_vars</span>
    {#if collapse}
      <p>...</p>
    {/if}
  </div>

  {#if !collapse}
    <Editable
      label="key"
      value={env.key}
      on:input={codeStore.updateEnv(resourceIdx, vmIdx, idx, "key")}
    />
    <Editable
      label="value"
      value={env.value}
      on:input={codeStore.updateEnv(resourceIdx, vmIdx, idx, "value")}
    />
  {/if}
</div>
