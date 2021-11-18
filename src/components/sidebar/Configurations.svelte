<script lang="ts">
  import mnemonicsStore from "src/store/mnemonics.store";
  import Selectable from "../base/Selectable.svelte";
  import { NetworkEnv } from "grid3_client";
  $: mnemStore = $mnemonicsStore;

  export const networkEnvOptions = Object.values(NetworkEnv);
</script>

<section class="container">
  <div>
    <p>Network Environment</p>
    <Selectable
      options={networkEnvOptions}
      on:change={mnemonicsStore.updateNetworkEnv}
      style=""
    />
  </div>
  <div>
    <p>Mnemonics</p>
    <input
    placeholder="Enter your mnemonics"
    value={mnemStore.mnemonics}
    type="password"
    on:input={mnemonicsStore.updateMnemonics}
    />
  </div>
  <div>
    <p>KV Secret</p>
    <input
      placeholder="Enter your KV secret"
      value={mnemStore.kvSecret}
      type="password"
      on:input={mnemonicsStore.updateKvSecret}
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
