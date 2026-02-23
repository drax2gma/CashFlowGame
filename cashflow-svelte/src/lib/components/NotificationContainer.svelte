<script lang="ts">
  import { notificationsStore } from '../stores/notificationStore';
  import Notification from './Notification.svelte';
</script>

<div class="notification-container">
  {#each $notificationsStore as notification (notification.id)}
    <Notification
      message={notification.message}
      type={notification.type}
      duration={notification.duration}
      dismissible={notification.dismissible}
      on:close={() => notificationsStore.remove(notification.id)}
    />
  {/each}
</div>

<style>
  .notification-container {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1000;
    pointer-events: none;
  }
  
  :global(.notification-container > *) {
    pointer-events: auto;
    margin: var(--spacing-md);
  }
</style>