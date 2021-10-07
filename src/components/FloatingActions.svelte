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

  function onDeployHandler() {
    close();

    console.log({ mnemStore, store });
  }
</script>

{#if mnemonicsIsNeeded}
  <div class="layout">
    <div class="layout__mnemonics">
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
      <div class="layout__mnemonics__actions">
        <button class="btn btn-sm btn-cancel" on:click={close}>Cancel</button>
        <button
          class="btn btn-sm btn-store"
          {disabled}
          on:click={onDeployHandler}>Deploy</button
        >
      </div>
    </div>
  </div>
{/if}

<button on:click={open} class="btn btn-deploy" disabled={!active}>
  Deploy
</button>

<style lang="scss" scoped>
  .layout {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(#333, 0.3);

    &__mnemonics {
      background-color: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      min-width: 500px;

      @media (max-width: 550px) {
        min-width: 90%;
      }

      p {
        margin-bottom: 1rem;
      }

      textarea,
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

      &__actions {
        display: flex;
        justify-content: flex-end;
      }
    }
  }

  .btn {
    border: none;
    border-radius: 0.5rem;
    background-color: #2196f3;
    padding: 1.5rem 3rem;
    font-weight: bold;
    cursor: pointer;
    font-size: 1.6rem;

    &[disabled] {
      background-color: #ccc;
      pointer-events: none;
    }

    &-deploy {
      position: fixed;
      right: 1.5rem;
      bottom: 1.5rem;
      z-index: 1;
    }

    &-sm {
      padding: 1rem 2rem;
      font-size: 1.4rem;
      color: white;
    }

    &-cancel {
      background-color: #f44336;
      margin-right: 1rem;
    }

    &-store {
      background-color: #673ab7;
    }
  }
</style>
