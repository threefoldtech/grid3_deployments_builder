<script lang="ts">
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    console.log(e.dataTransfer.getData("data"));
  };
</script>

<div class="droppable" on:dragover={(e) => e.preventDefault()} on:drop={onDrop}>
  <p>drop on me</p>
</div>

<style lang="scss" scoped>
  .droppable {
    height: 100%;
    width: 100%;
    background-color: var(--sidenav-border);
  }
</style>
