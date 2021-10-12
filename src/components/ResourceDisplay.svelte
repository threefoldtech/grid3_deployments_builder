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
    <img src="/assets/kubernetes.png" alt="deployment icon" width="40" />
    {/if}
    <span class="keyword">{resource.type}</span>
    {#if collapse}
      <p>...</p>
    {:else}
      <!-- <Editable
        value={resource.name}
        style="margin: 0 1.5rem;"
        on:input={codeStore.updateResource("name", idx)}
      /> -->
    {/if}
  </div>
  {#if collapse}
    <br />
  {:else}
    <Editable
      label="name"
      value={resource.name}
      on:input={codeStore.updateResource("name", idx)}
    />
    {#if resource.type === "kubernetes"}
    <Editable
      label="Secret"
      value={resource.secret}
      type = "password"
      on:input={codeStore.updateResource("secret", idx)}
    />
    <Editable
      label="SSH_KEY"
      value={resource.sshKey}
      on:input={codeStore.updateResource("sshKey" ,idx)}
    />
    {/if}
    <Editable
      label="Description"
      value={resource.description}
      type = "text"
      on:input={codeStore.updateResource("description", idx)}
    />
    <Editable
      label="Metadata"
      value={resource.metadata}
      type = "text"
      on:input={codeStore.updateResource("metadata", idx)}
    />
  {/if}
</div>
