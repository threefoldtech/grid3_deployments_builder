<script lang="ts">
  export let msg: string = "";
  export let onClickConfirm = () => {};
  export let onClickCancel = () => {};
  export let disabled: boolean = false;
  export let confirmBtnDisplayText: string = "Confirm";
  export let cancelBtnDisplayText: string = "Cancel";
</script>

<div class="layout">
  <div class="layout__confirm">
    {#if msg}
    <pre id="json">{msg}</pre>
    {:else}
    <img src="/assets/loading.gif" alt="Loading"/>
    {/if}
    <div class="layout__confirm__actions">
      <button class="btn btn-sm btn-cancel" on:click={onClickCancel}
        >{cancelBtnDisplayText}
      </button>
      <button
        class="btn btn-sm btn-confirm"
        {disabled}
        on:click={onClickConfirm}
        >{confirmBtnDisplayText}
      </button>
    </div>
  </div>
</div>

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

    &__confirm {
      background-color: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      min-width: 500px;

      @media (max-width: 550px) {
        min-width: 90%;
      }

      pre {
        margin-bottom: 1rem;
      }

      img {
        width: 20%;
        margin-left: 200px;
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
    background-color: transparent;
    padding: 1.5rem;
    font-weight: bold;
    cursor: pointer;
    font-size: 1.6rem;

    &[disabled] {
      background-color: #ccc;
      pointer-events: none;
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

    &-confirm {
      background-color: #673ab7;
    }
  }
</style>
