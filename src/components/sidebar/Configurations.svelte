<script lang="ts">
  import mnemonicsStore from "src/store/mnemonics.store";
  import { NetworkEnv } from "grid3_client";
import Select from "svelte-select";
  $: mnemStore = $mnemonicsStore;
  let selectedNetEnv;
  $: {
    selectedNetEnv = mnemStore.networkEnv;
  }
  export const networkEnvOptions = Object.values(NetworkEnv)
    .filter((value) => typeof value === "string")
    .map((value) => value as string);
</script>

<section class="container">
  <div class="component">
    <div class="label">
      <img src="/assets/envNet.png" alt="Network Enviroment" />
      <p>Network Environment</p>
    </div>
    <Select
      items={networkEnvOptions}
      bind:value={mnemStore.networkEnv}
      on:select={mnemonicsStore.updateNetworkEnv}
    />
  </div>
  <div>
    <div class="label">
      <img src="/assets/mnemonics.png" alt="Mnemonics" />
      <p>Mnemonics</p>
    </div>
    <input
      placeholder="Enter your mnemonics"
      value={mnemStore.mnemonics}
      type="password"
      on:input={mnemonicsStore.updateMnemonics}
    />
  </div>
  <div>
    <div class="label">
      <img src="/assets/secret.png" alt="Mnemonics" />
      <p>KV Secret</p>
    </div>
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

  .label {
    height: 3rem;
    display: flex;
    flex-direction: row;
      align-items: center;
    p {
      padding: 5px 0px 0px 10px
    }
      img {
      width: 3rem;
    }
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
