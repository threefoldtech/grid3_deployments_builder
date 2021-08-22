<script lang="ts">
  import Sidebar from "./components/Sidebar.svelte";
</script>

<main>
  <Sidebar />
  <section>
    <p>hello world</p>
  </section>
</main>

<style lang="scss" scoped>
  main {
    padding-left: var(--sidenav-width);
  }
</style>
