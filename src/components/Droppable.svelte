<script lang="ts">
  import TeraForm from "./TeraForm.svelte";

  let active = false;

  const drop = {
    over(e: DragEvent) {
      e.preventDefault();
      active = true;
    },
    leave(e: DragEvent) {
      e.preventDefault();
      active = false;
    },
    drop(e: DragEvent) {
      e.preventDefault();
      active = false;
      console.log(e.dataTransfer.getData("data"));
    },
  };
</script>

<div
  class={"droppable " + (active ? "active" : "")}
  on:dragover={drop.over}
  on:drop={drop.drop}
  on:dragleave={drop.leave}
>
  <TeraForm />
</div>

<style lang="scss" scoped>
  .droppable {
    padding: 3rem;
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
