<script lang="ts">
  import type { Kubernetes, Resource } from "../../models";
  import codeStore from "../../store/code.store";
  import Collapse from "../base/Collapse.svelte";
  import Editable from "../base/Editable.svelte";

  export let kubernetes: Kubernetes;
  export let idx: number;

  let collapse = false;
</script>

<div class="resource">
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/kubernetes.png" alt="kubernetes icon" width="40" />
    <span class="keyword">Kubernetes Deployment</span>
    {#if collapse}
      <p>...</p>
    {:else if kubernetes.isDeployed}
      <img src="/assets/deployed.png" alt="deployed icon" width="20" />
    {:else}
      <img src="/assets/notdeployed.png" alt="not deployed icon" width="20" />
    {/if}
  </div>
  {#if collapse}
    <br />
  {:else}
    <Editable
      label="name"
      placeholder="Deployment name"
      value={kubernetes.name}
      on:input={codeStore.updateKubernetes("name", idx)}
      deployed={kubernetes.isDeployed}
    />
    <Editable
      label="Secret"
      value={kubernetes.secret}
      placeholder="Keep the secret in safe place"
      type="password"
      on:input={codeStore.updateKubernetes("secret", idx)}
      deployed={kubernetes.isDeployed}
    />
    <Editable
      label="SSH_KEY"
      value={kubernetes.sshKey}
      placeholder="Add ssh-key to access the cluster"
      on:input={codeStore.updateKubernetes("sshKey", idx)}
      deployed={kubernetes.isDeployed}
    />
    <Editable
      label="Description"
      value={kubernetes.description}
      placeholder="Describe your deployment"
      type="text"
      on:input={codeStore.updateKubernetes("description", idx)}
      deployed={kubernetes.isDeployed}
    />
    <Editable
      label="Metadata"
      value={kubernetes.metadata}
      type="text"
      placeholder="Add info about your deployment"
      on:input={codeStore.updateKubernetes("metadata", idx)}
      deployed={kubernetes.isDeployed}
    />
  {/if}
</div>
