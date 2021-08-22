<script lang="ts">
  import codeStore from "../store/code.store";
  import Block from "./Block.svelte";
  import DiskDisplay from "./DiskDisplay.svelte";
  import ResourceDisplay from "./ResourceDisplay.svelte";
  import VMDisplay from "./VMDisplay.svelte";
  import MountDisplay from "./MountDisplay.svelte";
  import EnvDisplay from "./EnvDisplay.svelte";
  import Droppable from "./Droppable.svelte";

  $: resource = $codeStore;
</script>

<div>
  <Droppable>
    <Block color="--resource">
      <ResourceDisplay {resource} />

      {#each resource.disks as disk, idx (disk.id)}
        <Block color="--disks">
          <DiskDisplay {idx} {disk} />
        </Block>
      {/each}

      {#each resource.vms as vm, idx (vm.id)}
        <Droppable {idx}>
          <Block color="--vms">
            <VMDisplay {vm} {idx} />

            {#each vm.mounts as mount, mIdx (mount.id)}
              <Block color="--mounts">
                <MountDisplay {mount} vmIdx={idx} idx={mIdx} />
              </Block>
            {/each}

            {#each vm.env_vars as env, eIdx (env.id)}
              <Block color="--env_vars">
                <EnvDisplay {env} vmIdx={idx} idx={eIdx} />
              </Block>
            {/each}
          </Block>
        </Droppable>
      {/each}
    </Block>
  </Droppable>
</div>

<style lang="scss" scoped>
  div {
    padding: 3rem;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
