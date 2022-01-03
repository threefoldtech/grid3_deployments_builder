<script lang="ts">
  import type { Project, ZDB } from "../../models";
  import codeStore from "../../store/code.store";
  import Collapse from "../base/Collapse.svelte";
  import Editable from "../base/Editable.svelte";
  import { ZdbModes } from "grid3_client";
  import CheckBox from "../base/CheckBox.svelte";
  import Node from "../base/Node.svelte";
  import Select from "svelte-select";

  export let project: Project;
  export let resourceIdx: number;
  export let idx: number;
  export let zdb: ZDB;
  let lastSelectedMode = zdb.mode;
  let collapse = false;

  let zdbModes = Object.values(ZdbModes);
</script>

<div>
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/storage.png" alt="deployment icon" width="40" />
    <span class="keyword">Zdb</span>
    {#if collapse}
      <p>...</p>
    {/if}
    {#if zdb.isDeployed}
      <img src="/assets/verfied.png" alt="deployed icon" width="20" />
    {:else}
      <img src="/assets/unpublished.png" alt="not deployed icon" width="20" />
    {/if}
  </div>

  {#if !collapse}
    <Editable
      label="Name"
      value={zdb.name}
      placeholder="Zdb name"
      on:input={codeStore.updateZdb(resourceIdx, idx, "name")}
      deployed={zdb.isDeployed}
    />
    <Editable
      label="Size"
      value={zdb.size}
      type="number"
      unit="GB"
      on:input={codeStore.updateZdb(resourceIdx, idx, "size")}
      deployed={zdb.isDeployed}
    />
    <Editable
      label="Password"
      type="password"
      value={zdb.password}
      placeholder="Enter your zdb password"
      on:input={codeStore.updateZdb(resourceIdx, idx, "password")}
      deployed={zdb.isDeployed}
    />
    <div class="select_mode">
      <span class="select_label">Mode: </span>
      <div class="select_menu">
        <Select
          items={zdbModes}
          bind:value={lastSelectedMode}
          on:select={codeStore.updateZdb(resourceIdx, idx, "mode")}
          isDisabled={zdb.isDeployed}
        />
      </div>
    </div>
    <CheckBox
      label="Public IP"
      deployed={zdb.isDeployed}
      checked={zdb.publicIp}
      color={"--zdb"}
      on:change={codeStore.updateZdb(resourceIdx, idx, "publicIp")}
    />
    {#if project.gridClient}
      <Node
        {project}
        lastSelectedValue={zdb.node}
        on:select={codeStore.updateZdb(resourceIdx, idx, "node")}
        deployed={zdb.isDeployed}
        resources={{
          cru: 0,
          mru: 0,
          sru: 0,
          publicIPs: zdb.publicIp,
          hru: zdb.size,
          gateway: false,
        }}
      />
    {:else}
      <p style="font-size:1.8rem">loading..</p>
    {/if}
  {/if}
</div>

<style lang="scss">
  .select_mode {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 2.5rem;
  }

  .select_menu {
    padding: 0.5rem;
    width: 150px;
  }
  .select_label {
    font-size: 1.8rem;
  }
</style>
