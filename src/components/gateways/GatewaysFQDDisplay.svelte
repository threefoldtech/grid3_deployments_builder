<script lang="ts">
  import type { GatewayFQDN } from "../../models";
  import codeStore from "../../store/code.store";
  import Collapse from "../base/Collapse.svelte";
  import Editable from "../base/Editable.svelte";

  export let  idx;
  export let gatewayfq: GatewayFQDN;

  let collapse = false;
</script>

<div>
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/gateways_fqdn.png" alt="deployment icon" width="40" />
    <span class="keyword">FQDN</span>
    {#if collapse}
      <p>...</p>
    {/if}
    {#if gatewayfq.isDeployed}
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
      value={gatewayfq.name}
      on:input={codeStore.updateGatewayFQDN("name", idx)}
      deployed={gatewayfq.isDeployed}
    />
    <Editable
      label="Node"
      value={gatewayfq.node}
      type="number"
      on:input={codeStore.updateGatewayFQDN("node", idx)}
      deployed={gatewayfq.isDeployed}
    />
    <Editable
      label="FQDN"
      value={gatewayfq.fqdn}
      on:input={codeStore.updateGatewayFQDN("fqdn", idx)}
      deployed={gatewayfq.isDeployed}
    />
    <Editable
      label="backends"
      value={gatewayfq.backends.join(", ")}
      on:input={codeStore.updateGatewayFQDN("backends", idx)}
      deployed={gatewayfq.isDeployed}
    />
    <Editable label="tlspassthrough" deployed={gatewayfq.isDeployed}>
      <input
        type="checkbox"
        checked={gatewayfq.tlsPassThrough}
        on:change={codeStore.updateGatewayFQDN("tlsPassThrough",idx)}
        disabled={gatewayfq.isDeployed}
      />
    </Editable>
  {/if}
</div>
