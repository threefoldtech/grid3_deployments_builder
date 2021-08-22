<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let collapse = false;
  function toggleCollapse() {
    collapse = !collapse;
    dispatch("collapse", collapse);
  }
</script>

<button
  class={`block__collapse ${collapse ? "collapse" : ""}`}
  on:click={toggleCollapse}
>
  <img src="/assets/arrow.svg" alt="collapse" height="15" width="15" />
</button>

<style lang="scss" scoped>
  .block__collapse {
    cursor: pointer;
    outline: none !important;
    background: none;
    border: none;
    position: absolute;
    top: 1.5rem;
    left: 1.5rem;
    transition: transform 0.3s ease;
    transform: rotate(90deg);

    &.collapse {
      transform: rotate(0);
    }
  }
</style>
