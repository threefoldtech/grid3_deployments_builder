<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  const dispatch = createEventDispatcher();

  export let type = "error";
  let image: string;

  switch (type) {
    case "loading":
      image = "/assets/deploying.gif";
      break;
    case "info":
      image = "/assets/infoWhite.png";
      break;
    case "success":
      image = "/assets/success.png";
      break;
    case "error":
      image = "/assets/error.png";
      break;
  }
  export let dismissible = true;
</script>

<article class={type} role="alert" transition:fade>
  <img src={image} alt={type} title={type} />
  <div class="text">
    <slot />
  </div>

  {#if dismissible}
    <button class="close" on:click={() => dispatch("dismiss")}>
      <img src="/assets/close.png" alt="close" />
    </button>
  {/if}
</article>

<style lang="scss">
  article {
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.2rem;
    display: flex;
    align-items: center;
    margin: 0 auto 0.5rem auto;
    width: auto;
  }
  .error {
    background: IndianRed;
  }
  .success {
    background: MediumSeaGreen;
  }
  .info,
  .loading {
    background: SkyBlue;
  }
  .text {
    margin-left: 1rem;
    padding: 1rem;
  }
  button {
    color: white;
    background: transparent;
    border: 0 none;
    padding: 0;
    margin: 0 0 0 auto;
    line-height: 1;
    font-size: 1rem;
    img {
      width: 20px;
    }
  }
  img {
    width: 30px;
  }
</style>
