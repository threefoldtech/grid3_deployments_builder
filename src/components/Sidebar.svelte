<script lang="ts">
  import codeStore from "../store/code.store";
  import type { Add_Types } from "../store/code.store";
  import SidebarBlock from "./SidebarBlock.svelte";

  $: code = $codeStore;

  function add(key: Add_Types) {
    return () => {
      codeStore.add(key);
    };
  }
</script>

<aside class="sidenav">
  {#if !code}
    <SidebarBlock label="resource" on:click={add("resource")} />
  {/if}
  {#if code}
    <SidebarBlock label="disks" on:click={add("disks")} />
    <SidebarBlock label="vms" on:click={add("vms")} />
    {#if code.vms.length > 0}
      <SidebarBlock label="mounts" on:click={add("mounts")} />
      <SidebarBlock label="env_vars" on:click={add("env_vars")} />
    {/if}
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
