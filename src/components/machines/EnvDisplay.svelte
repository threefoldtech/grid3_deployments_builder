<script lang="ts">
  import type { Env } from "../../models";
  import codeStore from "../../store/code.store";
  import Collapse from "../base/Collapse.svelte";
  import Editable from "../base/Editable.svelte";

  export let resourceIdx: number;
  export let vmIdx: number;
  export let idx: number;
  export let env: Env;

  let collapse = false;
</script>

<div>
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/env.svg" alt="deployment icon" width="40" />
    <span class="keyword">Environment Variable</span>
    {#if collapse}
      <p>...</p>
    {/if}
    {#if env.isDeployed}
      <img src="/assets/deployed.png" alt="deployed icon" width="20" />
    {:else}
      <img src="/assets/notdeployed.png" alt="not deployed icon" width="20" />
    {/if}
  </div>

  {#if !collapse}
    <Editable
      label="key"
      value={env.key}
      placeholder="Enviroment variable key"
      on:input={codeStore.updateEnv(resourceIdx, vmIdx, idx, "key")}
      deployed={env.isDeployed}
    />
    <Editable
      label="value"
      value={env.value}
      placeholder="Enviroment variable value"
      on:input={codeStore.updateEnv(resourceIdx, vmIdx, idx, "value")}
      deployed={env.isDeployed}
    />
  {/if}
</div>
