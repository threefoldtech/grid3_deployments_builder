<script lang="ts">
  import { fade } from "svelte/transition";
  import FileExplorer from "./components/sidebar/FileExplorer.svelte";
  import Builder from "./components/sidebar/Builder.svelte";
  import ProjectDisplay from "./components/ProjectDisplay.svelte";
  import FloatingActions from "./components/FloatingActions.svelte";
  import Configurations from "./components/sidebar/Configurations.svelte";
  import Droppable from "./components/base/Droppable.svelte";
  import { events } from "grid3_client";

  export let show_info: boolean = false;
  export let info_msg: string = "";
  const timeout = 5000;

  const open_info = (msg) => {
    show_info = true;
    info_msg = msg;
    setTimeout(hide_info, timeout)
  };
  const hide_info = () =>{
    show_info = false;
  }
  events.addListener("logs", open_info);

  let explorer = 0;
  const setExplorer = (x: number) => () => (explorer = x);
</script>

<aside class="sidenav">
  <div class="sidenav__actions">
    <img src="/assets/threefold.svg" alt="threefold" title="threefold logo" />
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
      <FileExplorer />
    {:else if explorer === 1}
      <Builder />
    {:else if explorer === 2}
      <Configurations />
    {/if}
  </div>
</aside>
<Droppable>
  <main>
    <ProjectDisplay />
  </main>
</Droppable>
<FloatingActions />

{#if show_info}
<div class="event_info_msg" transition:fade>
  <img src="/assets/deploying.gif" alt="deploying" title="deploying" />
  <p>{info_msg}</p>
</div>
{/if}

<style lang="scss" scoped>
  main {
    padding-left: var(--sidenav-width);
    height: 100%;
  }
  .event_info_msg {
    position: fixed;
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    align-items: center;
    top: 1.5rem;
    right: 1.5rem;
    height: 60px;
    width: auto;
    background: SkyBlue;
    border-radius: 0.5rem;

    img{
      width: 30px;
    }
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
    }
  }
</style>
