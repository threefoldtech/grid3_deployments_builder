<script lang="ts">
  import codeStore, { Add_Types } from "../../store/code.store";

  export let resourceIdx: number = undefined;
  export let idx: number = undefined;
  let active = false;

  const drop = {
    over(e: DragEvent) {
      e.preventDefault();
      e.stopPropagation();
      active = true;
    },
    leave(e: DragEvent) {
      e.preventDefault();
      e.stopPropagation();
      active = false;
    },
    drop(e: DragEvent) {
      e.preventDefault();
      e.stopPropagation();
      active = false;
      const item = e.dataTransfer.getData("data") as Add_Types;
      codeStore.add(item, resourceIdx, idx);
    },
  };
</script>

<div
  class={"droppable " + (active ? "active" : "")}
  on:dragover={drop.over}
  on:drop={drop.drop}
  on:dragleave={drop.leave}
>
  <slot />
</div>

<style lang="scss" scoped>
  .droppable {
    height: 100%;
    width: 100%;
    position: relative;

    &.active {
      color: green;
    }
  }
</style>
