<script lang="ts">
  import { fade } from "svelte/transition";

  export let msg: string;
  export let type: string = "info";
  let image: string;
  switch (type) {
    case "loading":
      image = "/assets/deploying.gif";
      break;
    case "info":
      image = "/assets/info_white.png";
      break;
    case "success":
      image = "/assets/success.png";
      break;
    case "error":
      image = "/assets/error.png";
      break;
  }
</script>
<div class="event__notification__msg {type}" transition:fade>
  <img src={image} alt="deploying" title="deploying" />
  <p>{msg}</p>
</div>

<style lang="scss">
  .event__notification__msg {
    position: fixed;
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    align-items: center;
    top: 1.5rem;
    right: 1.5rem;
    height: 60px;
    width: auto;
    border-radius: 0.5rem;

    img {
      width: 30px;
    }
  }
  .loading,
  .info {
    background: SkyBlue;
  }

  .success {
    background: MediumSeaGreen;
  }

  .error {
    background: IndianRed;
  }
</style>
