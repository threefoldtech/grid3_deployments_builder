<script lang="ts">
  import FileExplorer from "./components/sidebar/FileExplorer.svelte";
  import Builder from "./components/sidebar/Builder.svelte";
  import ProjectDisplay from "./components/ProjectDisplay.svelte";
  import FloatingActions from "./components/FloatingActions.svelte";
  import Configurations from "./components/sidebar/Configurations.svelte";
  import Droppable from "./components/base/Droppable.svelte";
  import { events } from "grid3_client";
  import { updateLastNotification } from "./store/notification.store"
  import Notifications from "./components/base/Notifications.svelte";

  events.addListener("logs", updateLastNotification);

  let explorer = 0;
  const setExplorer = (x: number) => () => (explorer = x);
</script>

<aside class="sidenav">
  <div class="sidenav__actions">
    <!-- Threefold Image -->
    <img src="/assets/threefold-favicon-black.png" alt="threefold" title="threefold logo" />
    <!-- Project Explorer -->
    <button
      on:click={setExplorer(0)}
      class={"sidenav__actions__item " + (explorer === 0 ? "active" : "")}
    >
      <img src="/assets/explorer.png" alt="explorer" title="File Explorer" />
    </button>
    <!-- Deployment Components -->
    <button
      on:click={setExplorer(1)}
      class={"sidenav__actions__item " + (explorer === 1 ? "active" : "")}
    >
      <img src="/assets/build.png" alt="builder" title="Resource Builder" />
    </button>
    <!-- Profile Manager -->
    <button
      on:click={setExplorer(2)}
      class={"sidenav__actions__item " + (explorer === 2 ? "active" : "")}
    >
      <img
        src="/assets/account.png"
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
<Notifications />

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

      img{
        width:6rem
      }
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
