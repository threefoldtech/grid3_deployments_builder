<script lang="ts">
  import codeStore from "./store/code.store";
  import Builder from "./components/Builder.svelte";
  import TerraForm from "./components/TerraForm.svelte";

  let explorer = 0;
  const setExplorer = (x: number) => () => (explorer = x);

  $: store = $codeStore;
</script>

<aside class="sidenav">
  <div class="sidenav__actions">
    <button
      on:click={setExplorer(0)}
      class={"sidenav__actions__item " + (explorer === 0 ? "active" : "")}
    >
      <img src="/assets/file.svg" alt="explorer" title="file explorer" />
    </button>
    <button
      on:click={setExplorer(1)}
      class={"sidenav__actions__item " + (explorer === 1 ? "active" : "")}
    >
      <img src="/assets/tools.svg" alt="builder" title="resource builder" />
    </button>
  </div>
  <div class="sidenav__content">
    {#if explorer === 0}
      <button
        class="sidenav__content__create"
        on:click={codeStore.addNewResource.bind(codeStore)}
      >
        Add New Resource</button
      >
      {#each store.resources as resource, i}
        <button
          class={"sidenav__content__project " +
            (store.active === i ? "active" : "")}
          on:click={codeStore.setActiveResource.bind(codeStore, i)}
        >
          {resource.name} - {i}
        </button>
      {/each}
    {:else if explorer === 1}
      <Builder />
    {/if}
  </div>
</aside>
<main>
  <TerraForm />
</main>

<style lang="scss" scoped>
  main {
    padding-left: var(--sidenav-width);
    height: 100%;
    background-color: var(--ground-bg);
  }

  .sidenav {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: var(--sidenav-width);
    display: flex;
    border: 0.1rem solid var(--sidenav-border);

    &__actions {
      width: 6rem;
      border: 0.1rem solid var(--sidenav-border);

      &__item {
        width: 6rem;
        height: 6rem;
        border: none;
        background: none;
        cursor: pointer;

        &:hover,
        &.active {
          background-color: #e9e9e9;
        }

        > img {
          width: 90%;
          max-width: 4.5rem;
        }
      }
    }

    &__content {
      width: calc(100% - 6rem);
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;

      &__create {
        width: 100%;
        padding: 2rem;
        cursor: pointer;
        margin-bottom: 1rem;
      }

      &__project {
        width: 100%;
        padding: 1.5rem;
        background: none;
        border: none;
        border-bottom: 0.1rem solid var(--sidenav-border);
        cursor: pointer;

        &.active {
          background-color: #e9e9e9;
        }
      }
    }
  }
</style>
