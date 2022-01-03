<script lang="ts">
  import codeStore from "src/store/code.store";

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
  <div class="explorer__project">
    <button
      class={"explorer__project__name " + (store.active === i ? "active" : "")}
      on:click={codeStore.setActiveProject.bind(codeStore, i)}
    >
      <strong>#{i}</strong>
      <input
        {type}
        value={project.name}
        disabled={!project.rename}
        on:input={codeStore.renameProject(i)}
      />
    </button>
    {#if store.active === i}
      <div class="explorer__project__control">
        <img
          src="/assets/delete.png"
          alt="delete"
          title="delete project"
          on:click={codeStore.removeProject.bind(codeStore, i)}
        />
        {#if !project.rename}
          <img
            src="/assets/edit.png"
            alt="edit"
            title="edit project"
            on:click={codeStore.updateProjectRename.bind(codeStore, i)}
          />
        {:else}
          <img
            src="/assets/save.png"
            alt="save"
            title="save project name"
            on:click={codeStore.updateProjectRename.bind(codeStore, i)}
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
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 0.1rem solid var(--sidenav-border);
  }
  .explorer__project__name {
    width: 80%;
    padding: 1rem;
    background: none;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border: none;
    cursor: pointer;

    input {
      width: 80%;
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

  .explorer__project__control {
    width: 20%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.5rem;
    cursor: pointer;

    img {
      width: 30px;
      height: 30px;
    }
  }
</style>
