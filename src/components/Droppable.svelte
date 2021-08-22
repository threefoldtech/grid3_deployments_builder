<script lang="ts">
  import codeStore from "../store/code.store";
  import type { Add_Types } from "../store/code.store";

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
      codeStore.add(item, idx);
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

    // &::after,
    // &::before {
    //   --offset: 4rem;
    //   content: "";
    //   height: calc(100% - calc(2 * var(--offset)));
    //   width: calc(100% - calc(2 * var(--offset)));
    //   position: absolute;
    //   top: var(--offset);
    //   left: var(--offset);
    //   border: 0.5rem solid var(--white);
    //   display: none;
    // }

    // &::after {
    //   content: "+";
    //   height: auto;
    //   width: auto;
    //   top: 50%;
    //   left: 50%;
    //   transform: translate(-50%, -50%);
    //   border: none;
    //   color: var(--white);
    //   font-size: 5rem;
    // }

    &.active {
      color: green;
      // &::after,
      // &::before {
      //   display: block;
      // }
    }
  }
</style>
