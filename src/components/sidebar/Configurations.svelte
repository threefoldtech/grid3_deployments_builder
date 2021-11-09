<script lang="ts">
  import mnemonicsStore from "src/store/mnemonics.store";
  $: mnemStore = $mnemonicsStore;
</script>

<section class="container">
  <div>
    <p>Explorer URL</p>
    <input
      placeholder="Explorer url"
      value={mnemStore.explorerUrl}
      on:input={mnemonicsStore.updateExplorerUrl}
    />
  </div>
  <div>
    <p>RMB Proxy URL</p>
    <input
      placeholder="rmb proxy"
      value={mnemStore.proxyUrl}
      on:input={mnemonicsStore.updateProxyUrl}
    />
  </div>
  <div>
    <p>Mnemonics</p>
    <input
      placeholder="mnemonics"
      value={mnemStore.mnemonics}
      type="password"
      on:input={mnemonicsStore.updateMnemonics}
    />
  </div>
</section>

<style lang="scss" scoped>
  .container {
    padding: 15px;
  }

  p {
    margin-bottom: 1rem;
  }

  input {
    max-width: 100%;
    width: 100%;
    height: 20rem;
    resize: none;
    border-radius: 5px;
    border-color: #ccc;
    padding: 1.5rem;
    margin-bottom: 1rem;
    outline: none !important;

    &:hover,
    &:focus {
      border-color: darken(#ccc, 20);
    }
  }

  input {
    height: auto;
    border-width: 1px;
  }
</style>
