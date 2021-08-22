<script lang="ts">
  export let color: string;

  $: style = `
    border-left-color: var(${color});
    background-color: var(${color}-bg);
  `;
</script>

<div class="block" {style}>
  <slot />
</div>

<style lang="scss" scoped>
  .block {
    padding: 2rem;
    border-left: 0.5rem solid transparent;
    margin-bottom: 1rem;
  }
</style>
