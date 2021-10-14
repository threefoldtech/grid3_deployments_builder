<script lang="ts">
  import codeStore from "./store/code.store";
  import Builder from "./components/Builder.svelte";
  import TerraForm from "./components/ProjectDisplay.svelte";
  import FloatingActions from "./components/FloatingActions.svelte";
  import Configurations from "./components/Configurations.svelte";
  import Droppable from "./components/Droppable.svelte";

  let type = "text";
  let explorer = 0;
  let disable: boolean[]= [true];
  const setExplorer = (x: number) => () => (explorer = x);
  import { loadFromFile, dumpToFile } from "grid3_client_ts";
  $: store = $codeStore;
</script>

<aside class="sidenav">
  <div class="sidenav__actions">
    <button
      on:click={setExplorer(0)}
      class={"sidenav__actions__item " + (explorer === 0 ? "active" : "")}
    >
      <img src="/assets/file.svg" alt="explorer" title="File Explorer" />
    </button>
    <button
      on:click={setExplorer(1)}
      class={"sidenav__actions__item " + (explorer === 1 ? "active" : "")}
    >
      <img src="/assets/tools.svg" alt="builder" title="Resource Builder" />
    </button>
    <button
      on:click={setExplorer(2)}
      class={"sidenav__actions__item " + (explorer === 2 ? "active" : "")}
    >
      <img
        src="/assets/settings.svg"
        alt="configs"
        title="Configuration Settings"
      />
    </button>
  </div>
  <div class="sidenav__content">
    {#if explorer === 0}
      <button
        class="sidenav__content__create"
        on:click={codeStore.add.bind(codeStore, "project")}
      >
        Add New Project
      </button>
      {#each store.projects as project, i}
        <button
          class={"sidenav__content__project " +
            (store.active === i ? "active" : "")}
          on:click={codeStore.setActiveProject.bind(codeStore, i)}
        >
          <strong>#{i}</strong>
          <input
            {type}
            value={project.name}
            disabled={disable[i]}
            on:input={codeStore.renameProject(i)}
            style="display: inline-block;"
          />
          <span
            style="display: inline-block; font-size: 1.5rem; color: red;"
            on:click={codeStore.removeProject.bind(codeStore, i)}
          >
            <img
              src="/assets/notdeployed.png"
              alt="edit"
              title="edit project"
              width="12"
            />
          </span>
          <span
            style="display: inline-block; margin-left: 20px; font-size: 1.5rem;"
            on:click={() => {
              disable[i] = !disable[i];
            }}
          >
            {#if disable[i]}
              <img
                src="/assets/edit.png"
                alt="edit"
                title="edit project"
                width="12"
              />
            {:else}
              <img
                src="/assets/deployed.png"
                alt="edit"
                title="save project"
                width="12"
              />
            {/if}
          </span>
        </button>
      {/each}
    {:else if explorer === 1}
      <Builder />
    {:else if explorer === 2}
      <Configurations />
    {/if}
  </div>
</aside>
<Droppable>
  <main>
    <TerraForm />
  </main>
</Droppable>
<FloatingActions />

<style lang="scss" scoped>
  main {
    padding-left: var(--sidenav-width);
    height: 100%;
  }
  .sidenav {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: var(--sidenav-width);
    display: flex;
    border: 0.1rem solid var(--sidenav-border);
    z-index: 99;
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

        input:disabled {
          border: none;
          background-color: transparent;
        }
      }
    }
  }
</style>
