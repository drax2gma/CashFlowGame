<script lang="ts">
  export let src = '';
  export let alt = '';
  export let name = '';
  export let size: 'small' | 'medium' | 'large' = 'medium';
  export let shape: 'circle' | 'square' | 'rounded' = 'circle';
  export let status: 'online' | 'offline' | 'away' | 'busy' | null = null;
</script>

<div 
  class="avatar" 
  class:small={size === 'small'}
  class:large={size === 'large'}
  class:circle={shape === 'circle'}
  class:square={shape === 'square'}
  class:rounded={shape === 'rounded'}
>
  {#if src}
    <img 
      src={src} 
      alt={alt || name} 
      class="avatar-image"
    />
  {:else if name}
    <div class="avatar-initials">
      {name.charAt(0).toUpperCase()}
    </div>
  {/if}
  
  {#if status}
    <div 
      class="avatar-status" 
      class:online={status === 'online'}
      class:offline={status === 'offline'}
      class:away={status === 'away'}
      class:busy={status === 'busy'}
    ></div>
  {/if}
</div>

<style>
  .avatar {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 40px;
  }
  
  .avatar.small {
    width: 32px;
    height: 32px;
  }
  
  .avatar.large {
    width: 64px;
    height: 64px;
  }
  
  .avatar.circle {
    border-radius: 50%;
  }
  
  .avatar.square {
    border-radius: 0;
  }
  
  .avatar.rounded {
    border-radius: 8px;
  }
  
  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .avatar.circle .avatar-image {
    border-radius: 50%;
  }
  
  .avatar.rounded .avatar-image {
    border-radius: 8px;
  }
  
  .avatar-initials {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--primary);
    color: var(--on-primary);
    font-weight: 600;
    font-size: 1.25rem;
  }
  
  .avatar.small .avatar-initials {
    font-size: 1rem;
  }
  
  .avatar.large .avatar-initials {
    font-size: 2rem;
  }
  
  .avatar-status {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 12px;
    height: 12px;
    border: 2px solid white;
    border-radius: 50%;
  }
  
  .avatar.small .avatar-status {
    width: 10px;
    height: 10px;
  }
  
  .avatar.large .avatar-status {
    width: 16px;
    height: 16px;
  }
  
  .avatar-status.online {
    background-color: var(--success);
  }
  
  .avatar-status.offline {
    background-color: #9e9e9e;
  }
  
  .avatar-status.away {
    background-color: var(--warning);
  }
  
  .avatar-status.busy {
    background-color: var(--error);
  }
</style>