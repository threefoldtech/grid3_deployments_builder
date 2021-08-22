<script lang="ts">
  export let value: string | number;
  export let type: "number" | "text" = "text";
  export let label: string | null = null;
  export let style: string | undefined = "margin-left: 2.5rem;";
</script>

<div class="editable" {style}>
  {#if label}
    <span>{label}</span>
    <span>&nbsp; := &nbsp;</span>
  {/if}
  <input {type} {value} />
</div>

<style lang="scss" scoped>
  .editable {
    display: flex;
    margin: 1rem 0;
  }
</style>
