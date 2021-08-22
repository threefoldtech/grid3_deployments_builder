<script lang="ts">
  export let color: string;

  $: style = `
    border-left-color: var(${color});
  `;
</script>

<div class="block" {style}>
  <slot />
</div>

<style lang="scss" scoped>
  .block {
    background-color: var(--white);
    padding: 1.5rem;
    border-left: 0.5rem solid red;
    margin-bottom: 1rem;
  }
</style>
