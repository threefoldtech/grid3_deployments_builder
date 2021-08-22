<script lang="ts">
  import colorStore from "../store/color.store";

  $: keys = $colorStore;
</script>

<aside class="sidenav">
  {#each Object.entries(keys) as [key, color] (key)}
    <div
      class="block"
      draggable="true"
      style={"background-color:" + color}
      on:drag={(e) => e.dataTransfer.setData("data", key)}
    >
      <p>{key}</p>
    </div>
  {/each}
</aside>

<style lang="scss" scoped>
  .sidenav {
    position: fixed;
    top: 0;
    left: 0;
    width: var(--sidenav-width);
    height: 100%;
    border-right: 0.1rem solid #ccc;
    padding: 1.5rem;

    .block {
      margin-bottom: 1.5rem;
      padding: 2rem 0;
      display: flex;
      justify-content: center;
      align-items: center;

      // :TODO Add the right cursor
      cursor: pointer;

      p {
        text-transform: uppercase;
        color: white;
        font-size: 2.5rem;
      }
    }
  }
</style>
