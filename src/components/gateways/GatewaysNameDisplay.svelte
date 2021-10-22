<script lang="ts">
  import type { GatewayName } from "../../models";
  import codeStore from "../../store/code.store";
  import Collapse from "../base/Collapse.svelte";
  import Editable from "../base/Editable.svelte";

  export let idx: number;
  export let gateway: GatewayName;

  let collapse = false;
</script>

<div>
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/gateways.png" alt="deployment icon" width="40" />
    <span class="keyword">name</span>
    {#if collapse}
      <p>...</p>
    {/if}
    {#if gateway.isDeployed}
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
      value={gateway.name}
      on:input={codeStore.updateGatewayName("name", idx)}
      deployed={gateway.isDeployed}
    />
    <Editable
      label="Node"
      value={gateway.node}
      type="number"
      on:input={codeStore.updateGatewayName("node", idx)}
      deployed={gateway.isDeployed}
    />
    <Editable
      label="backends"
      value={gateway.backends.join(", ")}
      on:input={codeStore.updateGatewayName("backends", idx)}
      deployed={gateway.isDeployed}
    />
    <Editable label="TlsPassThrough" deployed={gateway.isDeployed}>
      <input
        type="checkbox"
        checked={gateway.tlsPassThrough}
        on:change={codeStore.updateGatewayName("tlsPassThrough", idx)}
        disabled={gateway.isDeployed}
      />
    </Editable>
  {/if}
</div>
