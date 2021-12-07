<script lang="ts">
  import { Machines } from "src/models";

  import type { Add_Types, IStore } from "src/store/code.store";
  import codeStore from "src/store/code.store";
  import SidebarBlock from "src/components/base/SidebarBlock.svelte";

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
          label="Network"
          img="../assets/network.png"
          type="network"
          level="0"
          on:click={add("network")}
        />
      {/if}
      <SidebarBlock
        label="Machines"
        img="../assets/vms.png"
        type="machines"
        level="0"
        on:click={add("machines")}
      />
      {#if hasMachines}
        <SidebarBlock
          label="Generic Machine"
          img="../assets/vm.png"
          type="machine"
          level="2"
          on:click={add("machine")}
        />
      {/if}
      {#if hasMachine}
        <SidebarBlock
          label="Disk"
          img="../assets/disk.png"
          type="disk"
          level="3"
          on:click={add("disk")}
        />
        <SidebarBlock
          label="QSFS Disk"
          img="../assets/qsfsDisk.png"
          type="qsfsDisk"
          level="3"
          on:click={add("qsfsDisk")}
        />
        <SidebarBlock
          label="Enviroment Variable"
          img="../assets/env.svg"
          type="envVar"
          level="3"
          on:click={add("envVar")}
        />
      {/if}
      <SidebarBlock
        label="Kubernetes"
        img="../assets/kubernetes.png"
        type="kubernetes"
        level="0"
        on:click={add("kubernetes")}
      />
      {#if hasKubernetes}
        <SidebarBlock
          label="Worker"
          img="../assets/kubernetes_worker.png"
          type="worker"
          level="2"
          on:click={add("worker")}
        />
        <SidebarBlock
          label="QSFS Disk"
          img="../assets/qsfsDisk.png"
          type="qsfsDisk"
          level="2"
          on:click={add("qsfsDisk")}
        />
      {/if}
      <SidebarBlock
        label="Zdbs"
        img="../assets/zdbs.png"
        type="zdbs"
        level="0"
        on:click={add("zdbs")}
      />
      {#if hasZDBs}
        <SidebarBlock
          label="Single Zdb"
          img="../assets/zdb.png"
          type="zdb"
          level="2"
          on:click={add("zdb")}
        />
      {/if}
      <SidebarBlock
        label="QSFS Zdbs"
        img="../assets/qsfsZdbs.png"
        type="qsfsZdbs"
        level="0"
        on:click={add("qsfsZdbs")}
      />
      <SidebarBlock
        label="Domain"
        img="../assets/gateways_fqdn.png"
        type="gatewayFQDN"
        level="0"
        on:click={add("gatewayFQDN")}
      />
      <SidebarBlock
        label="Domain Prefix"
        img="../assets/gateways.png"
        type="gatewayName"
        level="0"
        on:click={add("gatewayName")}
      />
    {/if}
  </div>
  <!-- <div class="sidenav__actions">
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
  </div> -->
</aside>

<style lang="scss" scoped>
  .sidenav {
    width: 100%;
    height: 100%;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;

    // &__actions {
    //   padding-top: 100px;
    //   margin-top: auto;

    //   > button {
    //     border: 3px solid;
    //     border-radius: 2rem;
    //     display: flex;
    //     height: 60px;
    //     margin: 1rem 0;

    //     &[disabled] {
    //       pointer-events: none !important;
    //     }

    //     a,
    //     label {
    //       display: flex;
    //       height: 100%;
    //       width: 100%;
    //       cursor: pointer;
    //       text-transform: capitalize;
    //       padding: 1.5rem;
    //       font-size: 2rem;
    //       font-weight: bold;
    //     }
    //     img {
    //       width: 50px;
    //       display: flex;
    //     }
    //   }
    // }
  }
</style>
