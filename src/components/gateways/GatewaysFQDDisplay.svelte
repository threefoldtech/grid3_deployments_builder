<script lang="ts">
  import { getClient, getDomain } from "src/grid3";

  import mnemonicsStore from "src/store/mnemonics.store";
  import { addSuccessNotification } from "src/store/notification.store";

  import type { GatewayFQDN } from "../../models";
  import codeStore from "../../store/code.store";
  import Collapse from "../base/Collapse.svelte";
  import ConfirmMsg from "../base/ConfirmMsg.svelte";
  import Editable from "../base/Editable.svelte";

  export let idx;
  export let gatewayfq: GatewayFQDN;

  $: store = $codeStore;
  $: mnemStore = $mnemonicsStore;

  let result = "";
  let showResult = false;

  const openResult = async () => {
    result = "";
    const project = store.projects[store.active];
    const gridClient = await getClient(mnemStore, project.name);
    getDomain(gridClient, gatewayfq.name).then((res) => {
      result = JSON.stringify(res, undefined, 2);
      gridClient.disconnect();
    });
    showResult = true;
  };

  const closeResult = () => (showResult = false);

  function copy() {
    navigator.clipboard.writeText(result);
    addSuccessNotification("Result copied to clipboard");
    closeResult();
  }

  let collapse = false;
</script>

<div>
  <Collapse on:collapse={(e) => (collapse = e.detail)} />
  <div class="header">
    <img src="/assets/gateways_fqdn.png" alt="deployment icon" width="40" />
    <span class="keyword">Domain</span>
    {#if collapse}
      <p>...</p>
    {/if}
    {#if gatewayfq.isDeployed}
      <img src="/assets/deployed.png" alt="deployed icon" width="20" />
      <button class="btn_result">
        <img src="/assets/info.png" alt="Result" on:click={openResult} />
      </button>
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
      placeholder="Deployment name"
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
      label="Domain"
      value={gatewayfq.domain}
      placeholder="Full domain"
      on:input={codeStore.updateGatewayFQDN("domain", idx)}
      deployed={gatewayfq.isDeployed}
    />
    <Editable
      label="backends"
      value={gatewayfq.backends.join(", ")}
      placeholder="Backends for the domain"
      on:input={codeStore.updateGatewayFQDN("backends", idx)}
      deployed={gatewayfq.isDeployed}
    />
    <Editable label="tlspassthrough" deployed={gatewayfq.isDeployed}>
      <input
        type="checkbox"
        checked={gatewayfq.tlsPassThrough}
        on:change={codeStore.updateGatewayFQDN("tlsPassThrough", idx)}
        disabled={gatewayfq.isDeployed}
      />
    </Editable>
  {/if}
</div>

{#if showResult}
  <ConfirmMsg
    msg={result}
    onClickConfirm={copy}
    confirmBtnDisplayText={"Copy"}
    onClickCancel={closeResult}
    cancelBtnDisplayText={"Close"}
    disabled={result === ""}
  />
{/if}

<style lang="scss">
  .btn_result {
    background: none;
    border: none;
    cursor: pointer;
    padding-left: 1rem;

    img {
      width: 20px;
    }
  }
</style>
