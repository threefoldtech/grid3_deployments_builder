<script lang="ts">
  import type { Resource } from "../models/resource";
  import codeStore from "../store/code.store";
  import Collapse from "./Collapse.svelte";
  import Editable from "./Editable.svelte";

  export let resource: Resource;
  export let idx: number;

  let collapse = false;
</script>

<div class="resource">
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    {#if resource.type === "deployment"}
    <img src="/assets/deployment.png" alt="deployment icon" width="40" />
    {:else if resource.type === "kubernetes"}
    <img src="/assets/kubernetes.png" alt="kubernetes icon" width="40" />
    {:else if resource.type === "zdbs"}
    <img src="/assets/zdbs.png" alt="zdbs icon" width="40" />
    {/if}
    <span class="keyword">{resource.type}</span>
    {#if collapse}
      <p>...</p>
    {:else}
      {#if resource.isDeployed }
      <img src="/assets/deployed.png" alt="deployed icon" width="20"/>
      {:else}
      <img src="/assets/notdeployed.png" alt="not deployed icon" width="20"/>
      {/if}
    {/if}
  </div>
  {#if collapse}
    <br />
  {:else}
    <Editable
      label="name"
      value={resource.name}
      on:input={codeStore.updateResource("name", idx)}
      deployed = {resource.isDeployed}
    />
    {#if resource.type === "kubernetes"}
    <Editable
      label="Secret"
      value={resource.secret}
      type = "password"
      on:input={codeStore.updateResource("secret", idx)}
      deployed = {resource.isDeployed}
    />
    <Editable
      label="SSH_KEY"
      value={resource.sshKey}
      on:input={codeStore.updateResource("sshKey" ,idx)}
      deployed = {resource.isDeployed}
    />
    {/if}
    <Editable
      label="Description"
      value={resource.description}
      type = "text"
      on:input={codeStore.updateResource("description", idx)}
      deployed = {resource.isDeployed}
    />
    <Editable
      label="Metadata"
      value={resource.metadata}
      type = "text"
      on:input={codeStore.updateResource("metadata", idx)}
      deployed = {resource.isDeployed}
    />
  {/if}
</div>
