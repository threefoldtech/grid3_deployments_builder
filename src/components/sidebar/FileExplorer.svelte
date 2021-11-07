<script lang="ts">
  import codeStore from "src/store/code.store";
  import { events } from "grid3_client";
  import { addInfoToast } from "src/store/toast.store";

  events.addListener("logs", addInfoToast);

  let type = "text";
  $: store = $codeStore;
</script>

<button
  class="explorer__create"
  on:click={codeStore.add.bind(codeStore, "project")}
>
  Add New Project
</button>
{#each store.projects as project, i}
  <div style="display:flex; justify-content: space-between;">
    <button
      class={"explorer__project " + (store.active === i ? "active" : "")}
      on:click={codeStore.setActiveProject.bind(codeStore, i)}
    >
      <strong>#{i}</strong>
      <input
        {type}
        value={project.name}
        disabled={!project.rename}
        on:input={codeStore.renameProject(i)}
        style="display: inline-block;"
      />
    </button>
    {#if store.active === i}
      <div class="explorer__control">
        <img
          src="/assets/notdeployed.png"
          alt="delete"
          title="delete project"
          on:click={codeStore.removeProject.bind(codeStore, i)}
        />
        {#if !project.rename}
          <img
            src="/assets/edit.png"
            alt="edit"
            title="edit project"
            on:click={() => {
              project.rename = !project.rename;
            }}
          />
        {:else}
          <img
            src="/assets/deployed.png"
            alt="save"
            title="save project name"
            on:click={() => {
              project.rename = !project.rename;
            }}
          />
        {/if}
      </div>
    {/if}
  </div>
{/each}

<style lang="scss" scoped>
  .explorer__create {
    width: 100%;
    padding: 2rem;
    cursor: pointer;
    margin-bottom: 1rem;
  }

  .explorer__project {
    width: 100%;
    padding: 1rem;
    background: none;
    border: none;
    border-bottom: 0.1rem solid var(--sidenav-border);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    cursor: pointer;

    input {
      font-size: 15px;
    }

    &.active {
      background-color: #e9e9e9;

      input {
        font-weight: bold;
      }
    }

    input:disabled {
      border: none;
      background-color: transparent;
    }
  }

  .explorer__control {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    padding: 0 1rem;
    cursor: pointer;

    img {
      padding-top: 5px;
      padding-bottom: 5px;
      width: 15px;
    }
  }
</style>
