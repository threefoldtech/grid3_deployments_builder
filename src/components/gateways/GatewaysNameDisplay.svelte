<script lang="ts">
  import { getClient, getDomain } from "src/grid3";
  import mnemonicsStore from "src/store/mnemonics.store";
  import { addSuccessNotification } from "src/store/notification.store";

  import type { GatewayName, Project } from "../../models";
  import codeStore from "../../store/code.store";
  import Collapse from "../base/Collapse.svelte";
  import ConfirmMsg from "../base/ConfirmMsg.svelte";
  import Editable from "../base/Editable.svelte";
  import CheckBox from "../base/CheckBox.svelte";
  import Node from "../base/Node.svelte";

  export let project: Project;
  export let idx: number;
  export let gateway: GatewayName;
  $: store = $codeStore;
  $: mnemStore = $mnemonicsStore;

  let result = "";
  let showResult = false;

  const openResult = async () => {
    result = "";
    const project = store.projects[store.active];
    const gridClient = await getClient(mnemStore, project.name);
    getDomain(gridClient, gateway.name).then((res) => {
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
    <img src="/assets/domainPrefix.png" alt="deployment icon" width="40" />
    <span class="keyword">Prefix Domain</span>
    {#if collapse}
      <p>...</p>
    {/if}
    {#if gateway.isDeployed}
      <img src="/assets/verfied.png" alt="deployed icon" width="20" />
      <button class="btn_result">
        <img src="/assets/info.png" alt="Result" on:click={openResult} />
      </button>
    {:else}
      <img src="/assets/unpublished.png" alt="not deployed icon" width="20" />
    {/if}
  </div>

  {#if collapse}
    <br />
  {:else}
    <Editable
      label="Name"
      value={gateway.name}
      placeholder="Deployment name"
      on:input={codeStore.updateGatewayName("name", idx)}
      deployed={gateway.isDeployed}
    />
    <Editable
      label="Prefix"
      value={gateway.prefix}
      placeholder="Domain prefix"
      on:input={codeStore.updateGatewayName("prefix", idx)}
      deployed={gateway.isDeployed}
    />
    <Editable
      label="backends"
      value={gateway.backends.join(", ")}
      placeholder="Backends for the domain"
      on:input={codeStore.updateGatewayName("backends", idx)}
      deployed={gateway.isDeployed}
    />
    <CheckBox
      label="TlsPassThrough"
      deployed={gateway.isDeployed}
      checked={gateway.tlsPassThrough}
      color={"--name"}
      on:change={codeStore.updateGatewayName("tlsPassThrough", idx)}
    />
    {#if project.gridClient}
      <Node
        {project}
        lastSelectedValue={gateway.node}
        on:select={codeStore.updateGatewayName("node", idx)}
        deployed={gateway.isDeployed}
        resources={{
          cru: 0,
          mru: 0,
          sru: 0,
          publicIPs: false,
          hru: 0,
          gateway: true,
        }}
      />
    {:else}
      <p style="font-size:1.8rem">loading..</p>
    {/if}
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
