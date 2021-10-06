<script lang="ts">
  import type { Add_Types, IStore } from "../store/code.store";
  import codeStore from "../store/code.store";
  import SidebarBlock from "./SidebarBlock.svelte";

  $: store = $codeStore;
  $: idx = store.active;
  $: code = store.projects[idx];
  $: hasVms = code && code.resources.some((r) => r.vms.length > 0);
  $: hasNetwork = code && code.network;

  function add(key: Add_Types) {
    return () => {
      codeStore.add(key);
    };
  }

  function exportAsJson(value: IStore) {
    const json = JSON.stringify(value);
    return `data:image/png;base64,${btoa(json)}`;
  }

  function importFromJson(e: Event) {
    const inp = e.target as HTMLInputElement;
    if (inp.files.length === 0) return;

    const file = inp.files.item(0);
    if (file.type.indexOf("json") === -1) return;

    const reader = new FileReader();
    reader.readAsText(file, "utf-8");

    reader.onload = (e) => {
      reader.onload = null;
      try {
        codeStore.set(JSON.parse(e.target.result as string));
      } catch {}
    };
  }
</script>

<aside class="sidenav">
  <div>
    {#if !code}
      <p>Please select project</p>
    {:else if code}
      <SidebarBlock label="resource" on:click={add("resource")} />
      <SidebarBlock label="zdbs" on:click={add("zdbs")} />
      {#if !hasNetwork}
        <SidebarBlock label="network" on:click={add("network")} />
      {/if}
      {#if code.resources.length}
        <SidebarBlock label="disks" on:click={add("disks")} />
        <SidebarBlock label="vms" on:click={add("vms")} />
        <SidebarBlock label="master" on:click={add("master")} />
        <SidebarBlock label="worker" on:click={add("worker")} />
        {#if hasVms}
          <SidebarBlock label="mounts" on:click={add("mounts")} />
          <SidebarBlock label="env_vars" on:click={add("env_vars")} />
        {/if}
      {/if}
    {/if}
  </div>
  <div class="sidenav__actions">
    <button>
      <input
        id="f"
        type="file"
        hidden
        accept="application/JSON"
        on:change={importFromJson}
      />
      <label for="f"> import json </label>
    </button>
    <button disabled={!code}>
      <a download="store.json" href={exportAsJson(store)}> export as json </a>
    </button>
  </div>
</aside>

<style lang="scss" scoped>
  .sidenav {
    width: 100%;
    height: 100%;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;

    &__actions {
      padding-top: 100px;
      margin-top: auto;

      > button {
        display: block;
        width: 100%;
        margin: 1rem 0;

        &[disabled] {
          pointer-events: none !important;
        }

        a,
        label {
          display: block;
          height: 100%;
          width: 100%;
          cursor: pointer;
          text-transform: capitalize;
          padding: 1.5rem 0;
          font-size: 2rem;
        }
      }
    }
  }
</style>
