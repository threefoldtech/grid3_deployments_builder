<script lang="ts">
  import Sidebar from "./components/Sidebar.svelte";
  import TerraForm from "./components/TerraForm.svelte";
</script>

<main>
  <Sidebar />
  <TerraForm />
</main>

<style lang="scss" scoped>
  main {
    padding-left: var(--sidenav-width);
    height: 100%;
  }
</style>
