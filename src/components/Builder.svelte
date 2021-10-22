<script lang="ts">
import { Machines } from "src/models";

  import type { Add_Types, IStore } from "../store/code.store";
  import codeStore from "../store/code.store";
  import SidebarBlock from "./base/SidebarBlock.svelte";

  $: store = $codeStore;
  $: idx = store.active;
  $: code = store.projects[idx];
  $: hasNetwork = code && code.network;
  $: hasKubernetes = code && code.resources.some((r) => r.type === "kubernetes"); //prettier-ignore
  $: hasMachines = code && code.resources.some((r) => r.type === "machines"); //prettier-ignore
  $: hasMachine = hasMachines && code.resources.some((r) => r.type === "machines" && (r as Machines).machines.length); //prettier-ignore
  $: hasZDBs = code && code.resources.some((r) => r.type === "zdbs"); //prettier-ignore;


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
      {#if !hasNetwork}
        <SidebarBlock
          label="network"
          img="../assets/network.png"
          on:click={add("network")}
        />
      {/if}
      <SidebarBlock
        label="machines"
        img="../assets/vms.png"
        on:click={add("machines")}
      />
      {#if hasMachines }
        <SidebarBlock
          label="machine"
          img="../assets/vm.png"
          on:click={add("machine")}
        />
      {/if}
      {#if hasMachine }
        <SidebarBlock
          label="disk"
          img="../assets/disk.png"
          on:click={add("disk")}
        />
        <!-- TODO: Not Implemented -->
        <SidebarBlock 
          label="qsfs disk" 
          img="../assets/disk.png"
          on:click={add("disk")}
        />
        <!-- --------------------- -->
        <SidebarBlock
          label="envVar"
          img="../assets/env.svg"
          on:click={add("envVar")}
        />
      {/if}
      <SidebarBlock
        label="kubernetes"
        img="../assets/kubernetes.png"
        on:click={add("kubernetes")}
      />
      {#if hasKubernetes }
        <SidebarBlock
          label="master"
          img="../assets/kubernetes_master.png"
          on:click={add("master")}
        />
        <SidebarBlock
          label="worker"
          img="../assets/kubernetes_worker.png"
          on:click={add("worker")}
        />
      {/if}
      <SidebarBlock
        label="zdbs"
        img="../assets/zdbs.png"
        on:click={add("zdbs")}
      />
      {#if hasZDBs }
        <SidebarBlock
          label="zdb"
          img="../assets/zdb.png"
          on:click={add("zdb")}
        />
      {/if}
      <!-- TODO: Not Implemented -->
      <SidebarBlock
        label="qsfs zdbs"
        img="../assets/zdbs.png"
        on:click={add("zdbs")}
      />
      <!-- --------------------- -->
      <SidebarBlock
        label="gatewayFQDN"
        img="../assets/gateways_fqdn.png"
        on:click={add("gatewayFQDN")}
      />
      <SidebarBlock
        label="gatewayName"
        img="../assets/gateways.png"
        on:click={add("gatewayName")}
      />
    {/if}
  </div>
  <div class="sidenav__actions">
    <button>
      <img src="/assets/import.png" alt="import icon" width="40" />
      <input
        id="f"
        type="file"
        hidden
        accept="application/JSON"
        on:change={importFromJson}
      />
      <label for="f">Import</label>
    </button>
    <button disabled={!code}>
      <img src="/assets/export.png" alt="export icon" width="40" />
      <a download="store.json" href={exportAsJson(store)}>Export</a>
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
        border: 3px solid;
        border-radius: 2rem;
        display: flex;
        width: 200px;
        height: 60px;
        margin: 1rem 0;

        &[disabled] {
          pointer-events: none !important;
        }

        a,
        label {
          display: flex;
          height: 100%;
          width: 100%;
          cursor: pointer;
          text-transform: capitalize;
          padding: 1.5rem;
          font-size: 2rem;
          font-weight: bold;
        }
        img {
          width: 50px;
          display: flex;
        }
      }
    }
  }
</style>
