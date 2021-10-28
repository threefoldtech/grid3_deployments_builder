<script lang="ts">
  import type { Machines, Resource } from "../../models";
  import codeStore from "../../store/code.store";
  import Collapse from "../base/Collapse.svelte";
  import Editable from "../base/Editable.svelte";

  export let machines: Machines;
  export let idx: number;

  let collapse = false;
</script>

<div class="resource">
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/vms.png" alt="deployment icon" width="40" />
    <span class="keyword">Machines Deployment</span>
    {#if collapse}
      <p>...</p>
    {:else if machines.isDeployed}
      <img src="/assets/deployed.png" alt="deployed icon" width="20" />
    {:else}
      <img src="/assets/notdeployed.png" alt="not deployed icon" width="20" />
    {/if}
  </div>
  {#if collapse}
    <br />
  {:else}
    <Editable
      label="Name"
      value={machines.name}
      placeholder="Deployment name"
      on:input={codeStore.updateResource("name", idx)}
      deployed={machines.isDeployed}
    />
    <Editable
      label="Description"
      value={machines.description}
      placeholder="Describe your deployment"
      on:input={codeStore.updateResource("description", idx)}
      deployed={machines.isDeployed}
    />
    <Editable
      label="Metadata"
      value={machines.metadata}
      placeholder="Add info about your deployment"
      on:input={codeStore.updateResource("metadata", idx)}
      deployed={machines.isDeployed}
    />
  {/if}
</div>
