<script lang="ts">
  import type { Resource } from "../store/code.store";
  import codeStore from "../store/code.store";
  import Editable from "./Editable.svelte";

  export let resource: Resource;
</script>

<div class="resource">
  <div class="resource__head">
    <span class="keyword">resource</span>
    <Editable
      value={resource.name}
      style="margin: 0 1.5rem;"
      on:input={codeStore.updateResource("name")}
    />
    <Editable
      value={resource.title}
      on:input={codeStore.updateResource("title")}
    />
  </div>
  <Editable
    label="node"
    value={resource.node}
    type="number"
    on:input={codeStore.updateResource("node")}
  />
</div>

<style lang="scss" scoped>
  .resource {
    &__head {
      display: flex;
      align-items: center;
    }
  }
</style>
