<script lang="ts">
  import type { Resource } from "../store/code.store";
  import Editable from "./Editable.svelte";

  export let resource: Resource;
</script>

<div class="resource">
  <div class="resource__head">
    <span class="keyword">resource</span>
    <Editable value={resource.name} style="margin: 0 1.5rem;" />
    <Editable value={resource.title} />
  </div>
  <Editable label="node" value={resource.node} type="number" />
</div>

<style lang="scss" scoped>
  .resource {
    &__head {
      display: flex;
      align-items: center;
    }
  }
</style>
