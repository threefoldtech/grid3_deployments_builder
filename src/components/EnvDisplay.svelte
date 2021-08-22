<script lang="ts">
  import type { Env } from "../store/code.store";
  import Editable from "./Editable.svelte";

  export let env: Env;
</script>

<div>
  <span class="keyword">env_vars</span>

  <Editable label="key" value={env.key} />
  <Editable label="value" value={env.value} />
</div>
