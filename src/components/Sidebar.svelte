<script lang="ts">
  import type { Add_Types, Resource } from "../store/code.store";
  import codeStore from "../store/code.store";
  import SidebarBlock from "./SidebarBlock.svelte";
  import toTerraform from "../utils/toTerrfaform";

  $: code = $codeStore;

  function add(key: Add_Types) {
    return () => {
      codeStore.add(key);
    };
  }

  function exportAsJson(value: Resource) {
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
      <a download={`${code?.name}.json`} href={exportAsJson(code)}>
        export as json
      </a>
    </button>
    <button disabled={!code}>
      <a
        download={`${code?.name}.tf`}
        href={`data:image/png;base64,${btoa(toTerraform(code))}`}
      >
        export as terraform
      </a>
    </button>
  </div>
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
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;

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
