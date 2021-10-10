<script lang="ts">
  export let label: string;
  export let img: string
</script>

<div
  class="block"
  draggable="true"
  style={"background-color: var(--" + label + ");"}
  on:dragstart={(e) => e.dataTransfer.setData("data", label)}
  on:click
>
  <img src= {img} alt={label} title={label} />
  <p>{label}</p>
</div>

<style lang="scss" scoped>
  .block {
    border-radius: 2rem;
    margin-bottom: 1.5rem;
    padding: 2rem 0;
    display: flex;
    justify-content: left;
    align-items: center;
    cursor: pointer;
    width: 200px;
    height: 80px;

    p {
      text-transform: capitalize;
      color: var(--white);
      font-size: 2rem;
    }
    
    img {
      padding: 0.5rem;
      max-width: 100%;
      max-height: 100%;
    }
  }
</style>
