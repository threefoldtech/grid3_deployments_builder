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
    {#if resource}
      <Block color="--resource" on:click={() => codeStore.set(null)}>
        <ResourceDisplay {resource} />

        {#each resource.disks as disk, idx (disk.id)}
          <Block
            color="--disks"
            on:click={codeStore.removeFromResource("disks", idx)}
          >
            <DiskDisplay {idx} {disk} />
          </Block>
        {/each}

        {#each resource.vms as vm, idx (vm.id)}
          <Droppable {idx}>
            <Block
              color="--vms"
              on:click={codeStore.removeFromResource("vms", idx)}
            >
              <VMDisplay {vm} {idx} />

              {#each vm.mounts as mount, mIdx (mount.id)}
                <Block
                  color="--mounts"
                  on:click={codeStore.removeFromVm(idx, "mounts", mIdx)}
                >
                  <MountDisplay {mount} vmIdx={idx} idx={mIdx} />
                </Block>
              {/each}

              {#each vm.env_vars as env, eIdx (env.id)}
                <Block
                  color="--env_vars"
                  on:click={codeStore.removeFromVm(idx, "env_vars", eIdx)}
                >
                  <EnvDisplay {env} vmIdx={idx} idx={eIdx} />
                </Block>
              {/each}
            </Block>
          </Droppable>
        {/each}
      </Block>
    {/if}
  </Droppable>
</div>

<style lang="scss" scoped>
  div {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
