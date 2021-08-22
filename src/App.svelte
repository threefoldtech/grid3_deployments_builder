<script lang="ts">
  import Sidebar from "./components/Sidebar.svelte";
  import Droppable from "./components/Droppable.svelte";
</script>

<main>
  <Sidebar />
  <section class="content">
    <Droppable />
  </section>
</main>

<style lang="scss" scoped>
  main {
    padding-left: var(--sidenav-width);
    height: 100%;

    .content {
      background-color: var(--ground-bg);
    }
  }
</style>
