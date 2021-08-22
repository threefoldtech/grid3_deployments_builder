<script lang="ts">
  import type { Env } from "../store/code.store";
  import codeStore from "../store/code.store";
  import Editable from "./Editable.svelte";

  export let vmIdx: number;
  export let idx: number;
  export let env: Env;
</script>

<div>
  <span class="keyword">env_vars</span>

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
