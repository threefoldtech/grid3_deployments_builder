<script lang="ts">
    import codeStore from "../store/code.store";
    import mnemonicsStore from "../store/mnemonics.store";
  
    $: store = $codeStore;
    $: active = store.active > -1;
  
    let mnemonicsIsNeeded = false;
  
    const open = () => (mnemonicsIsNeeded = true);
    const close = () => (mnemonicsIsNeeded = false);
  
    $: mnemStore = $mnemonicsStore;
    $: disabled = mnemStore.mnemonics.length === 0 || mnemStore.twinId.length === 0; // prettier-ignore
</script>
<div>
    <p>Please Enter Your Explorer url:</p>
    <input
      placeholder="Explorer url"
      value={mnemStore.explorerUrl}
      on:input={mnemonicsStore.updateExplorerUrl}
    />
  </div>
  <div>
    <p>Please Enter Your RMB proxy url:</p>
    <input
      placeholder="rmb proxy"
      value={mnemStore.proxyUrl}
      on:input={mnemonicsStore.updateProxyUrl}
    />
  </div>
  <div>
    <p>Please Enter Your TwinID:</p>
    <input
      placeholder="twinid"
      value={mnemStore.twinId}
      on:input={mnemonicsStore.updateTwinid}
    />
  </div>
  <div>
    <p>Please Enter Your Mnemonics:</p>
    <textarea
      placeholder="mnemonics"
      value={mnemStore.mnemonics}
      on:input={mnemonicsStore.updateMnemonics}
    />
  </div>