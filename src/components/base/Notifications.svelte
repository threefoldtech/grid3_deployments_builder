<script lang="ts">
    import Notification from "./Notification.svelte";
  
    import { dismissNotification, notifications } from "../../store/notification.store";
  </script>
  
  {#if $notifications}
    <section>
      {#each $notifications as notification (notification.id)}
        <Notification
          type={notification.type}
          dismissible={notification.dismissible}
          on:dismiss={() => dismissNotification(notification.id)}>{notification.message}
          </Notification>
      {/each}
    </section>
  {/if}
  
  <style lang="postcss">
    section {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      display: flex;
      margin-top: 1rem;
      justify-content: center;
      flex-direction: column;
      z-index: 1000;
    }
  </style>