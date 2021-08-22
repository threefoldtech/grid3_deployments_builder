<script lang="ts">
  import type { Env } from "../store/code.store";
  import codeStore from "../store/code.store";
  import Editable from "./Editable.svelte";

  export let vmIdx: number;
  export let idx: number;
  export let env: Env;
</script>

<div>
  <div class="header">
    <img src="/assets/key.svg" alt="deployment icon" width="40" />
    <span class="keyword">env_vars</span>
  </div>

  <Editable
    label="key"
    value={env.key}
    on:input={codeStore.updateEnv(vmIdx, idx, "key")}
  />
  <Editable
    label="value"
    value={env.value}
    on:input={codeStore.updateEnv(vmIdx, idx, "value")}
  />
</div>
