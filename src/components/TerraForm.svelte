<script lang="ts">
  import codeStore from "../store/code.store";
  import Block from "./Block.svelte";
  import DiskDisplay from "./DiskDisplay.svelte";
  import ResourceDisplay from "./ResourceDisplay.svelte";
  import VMDisplay from "./VMDisplay.svelte";
  import MountDisplay from "./MountDisplay.svelte";
  import EnvDisplay from "./EnvDisplay.svelte";
  import Droppable from "./Droppable.svelte";
  import NetworkDisplay from "./NetworkDisplay.svelte";

  $: store = $codeStore;
  $: idx = store.active;
  $: project = store.projects[idx];
</script>

{#if project}
  {#if project.network}
    <Block
      color="--resource"
      on:click={codeStore.removeResource.bind(codeStore)}
    >
      <NetworkDisplay network={project.network} />
    </Block>
  {/if}
  {#each project.zdbs as zdb (zdb.id)}
    <!-- TODO -->
    {JSON.stringify(zdb)}
    <br />
  {/each}
  {#each project.resources as resource, resourceIdx (resource.id)}
    <div>
      <Droppable {resourceIdx}>
        <Block
          color="--resource"
          on:click={codeStore.removeResource.bind(codeStore)}
        >
          <ResourceDisplay {resource} idx={resourceIdx} />

          {#each resource.masters as master (master.id)}
            <!-- TODO -->
            {JSON.stringify(master)}
            <br />
          {/each}

          <hr />
          {#each resource.workers as worker (worker.id)}
            <!-- TODO -->
            {JSON.stringify(worker)}
            <br />
          {/each}

          {#each resource.disks as disk, idx (disk.id)}
            <Block
              color="--disks"
              on:click={codeStore.removeFromResource(resourceIdx, "disks", idx)}
            >
              <DiskDisplay {resourceIdx} {idx} {disk} />
            </Block>
          {/each}

          {#each resource.vms as vm, idx (vm.id)}
            <Droppable {resourceIdx} {idx}>
              <Block
                color="--vms"
                on:click={codeStore.removeFromResource(resourceIdx, "vms", idx)}
              >
                <VMDisplay {resourceIdx} {vm} {idx} />

                {#each vm.mounts as mount, mIdx (mount.id)}
                  <Block
                    color="--mounts"
                    on:click={codeStore.removeFromVm(
                      resourceIdx,
                      idx,
                      "mounts",
                      mIdx
                    )}
                  >
                    <MountDisplay
                      {resourceIdx}
                      {mount}
                      vmIdx={idx}
                      idx={mIdx}
                    />
                  </Block>
                {/each}

                {#each vm.env_vars as env, eIdx (env.id)}
                  <Block
                    color="--env_vars"
                    on:click={codeStore.removeFromVm(
                      resourceIdx,
                      idx,
                      "env_vars",
                      eIdx
                    )}
                  >
                    <EnvDisplay {resourceIdx} {env} vmIdx={idx} idx={eIdx} />
                  </Block>
                {/each}
              </Block>
            </Droppable>
          {/each}
        </Block>
      </Droppable>
    </div>
  {/each}
{:else}
  <p style="text-align: center; padding-top: 10rem; font-size: 2rem;">
    Please create or select a resource.
  </p>
{/if}
