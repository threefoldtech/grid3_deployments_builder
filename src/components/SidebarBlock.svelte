<script lang="ts">
  export let label: string;
</script>

<div
  class="block"
  draggable="true"
  style={"background-color: var(--" + label + ");"}
  on:dragstart={(e) => e.dataTransfer.setData("data", label)}
>
  <p>{label}</p>
</div>

<style lang="scss" scoped>
  .block {
    margin-bottom: 1.5rem;
    padding: 2rem 0;
    display: flex;
    justify-content: center;
    align-items: center;

    p {
      text-transform: uppercase;
      color: var(--white);
      font-size: 2.5rem;
    }
  }
</style>
