<script lang="ts">
  import codeStore from "../store/code.store";
  import SidebarBlock from "./SidebarBlock.svelte";

  $: code = $codeStore;
</script>

<aside class="sidenav">
  <SidebarBlock label="disks" />
  <SidebarBlock label="vms" />
  {#if code.vms.length > 0}
    <SidebarBlock label="mounts" />
    <SidebarBlock label="env_vars" />
  {/if}
</aside>

<style lang="scss" scoped>
  .sidenav {
    position: fixed;
    top: 0;
    left: 0;
    width: var(--sidenav-width);
    height: 100%;
    border-right: 0.1rem solid var(--sidenav-border);
    padding: 1.5rem;
  }
</style>
