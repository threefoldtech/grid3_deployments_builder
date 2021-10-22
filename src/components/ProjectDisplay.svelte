<script lang="ts">
  import codeStore from "src/store/code.store";
  import mnemonicsStore from "src/store/mnemonics.store";
  import Block from "./base/Block.svelte";
  import DiskDisplay from "./machines/DiskDisplay.svelte";
  import MachineDisplay from "./machines/MachineDisplay.svelte";
  import EnvDisplay from "./machines/EnvDisplay.svelte";
  import Droppable from "./base/Droppable.svelte";
  import NetworkDisplay from "./NetworkDisplay.svelte";
  import ZdbDisplay from "./zdbs/ZdbDisplay.svelte";
  import MasterDisplay from "./kubernetes/MasterDisplay.svelte";
  import WorkerDisplay from "./kubernetes/WorkerDisplay.svelte";
  import GatewaysFqdDisplay from "./gateways/GatewaysFQDDisplay.svelte";
  import GatewaysNameDisplay from "./gateways/GatewaysNameDisplay.svelte";
  import MachinesDisplay from "./machines/MachinesDisplay.svelte";
  import KubernetesDisplay from "./kubernetes/KubernetesDisplay.svelte";
  import ZdbsDisplay from "./zdbs/ZdbsDisplay.svelte";

  $: store = $codeStore;
  $: idx = store.active;
  $: project = store.projects[idx];
  $: mnemStore = $mnemonicsStore;
</script>

{#if project}
  {#if project.network}
    <Block color="--network" removeable={false}>
      <NetworkDisplay network={project.network} />
    </Block>
  {/if}
  {#each project.resources as resource, resourceIdx (resource.id)}
    <div>
      <Droppable {resourceIdx}>
        <Block
          color="--{resource.type}"
          on:click={codeStore.removeResource.bind(
            codeStore,
            resourceIdx,
            mnemStore
          )}
        >
          <!-- ---------------- Machines ---------------- -->
          {#if "machines" in resource}
            <MachinesDisplay machines={resource} idx={resourceIdx} />
            {#each resource.machines as vm, idx (vm.id)}
              <Droppable {resourceIdx} {idx}>
                <Block
                  color="--machine"
                  on:click={codeStore.removeVM.bind(
                    codeStore,
                    resourceIdx,
                    idx,
                    mnemStore
                  )}
                >
                  <MachineDisplay {resourceIdx} {vm} {idx} />

                  {#each vm.disks as disk, diskIdx (disk.id)}
                    <Block
                      color="--disk"
                      on:click={codeStore.removeFromVm(
                        resourceIdx,
                        idx,
                        "disks",
                        diskIdx
                      )}
                      removeable={!disk.isDeployed}
                    >
                      <DiskDisplay
                        {...{ resourceIdx, vmIdx: idx, idx: diskIdx, disk }}
                      />
                    </Block>
                  {/each}

                  {#each vm.env_vars as env, eIdx (env.id)}
                    <Block
                      color="--envVar"
                      on:click={codeStore.removeFromVm(
                        resourceIdx,
                        idx,
                        "env_vars",
                        eIdx
                      )}
                      removeable={!env.isDeployed}
                    >
                      <EnvDisplay {resourceIdx} {env} vmIdx={idx} idx={eIdx} />
                    </Block>
                  {/each}
                </Block>
              </Droppable>
            {/each}

          <!-- ---------------- Kubernetes ---------------- -->
          {:else if "masters" in resource}
            <KubernetesDisplay kubernetes={resource} idx={resourceIdx} />
            {#each resource.masters as master, i (master.id)}
              <Block
                color="--master"
                on:click={codeStore.removeMaster.bind(
                  codeStore,
                  resourceIdx,
                  i
                )}
                removeable={!master.isDeployed}
              >
                <MasterDisplay {resourceIdx} idx={i} {master} />
              </Block>
            {/each}

            {#each resource.workers as worker, i (worker.id)}
              <Block
                color="--worker"
                on:click={codeStore.removeWorker.bind(
                  codeStore,
                  resourceIdx,
                  i,
                  mnemStore
                )}
              >
                <WorkerDisplay {resourceIdx} idx={i} {worker} />
              </Block>
            {/each}

          <!-- ---------------- ZDBs ---------------- -->
          {:else if "zdbs" in resource}
            <ZdbsDisplay zdbs={resource} idx={resourceIdx} />
            {#each resource.zdbs as zdb, i (zdb.id)}
              <Block
                color="--zdb"
                on:click={codeStore.removeZdb.bind(
                  codeStore,
                  resourceIdx,
                  i,
                  mnemStore
                )}
              >
                <ZdbDisplay {resourceIdx} {zdb} idx={i} />
              </Block>
            {/each}

          <!-- ---------------- FQDN Gateway ---------------- -->
          {:else if "fqdn" in resource}
            <GatewaysFqdDisplay gatewayfq={resource} idx={resourceIdx} />
          
          <!-- ---------------- Name Gateway ---------------- -->
          {:else if "nameGateway" in resource}
           <GatewaysNameDisplay gateway={resource} idx={resourceIdx} />
          {/if}
        </Block>
      </Droppable>
    </div>
  {/each}
{:else}
  <p style="text-align: center; padding-top: 10rem; font-size: 2rem;">
    Please create or select a project.
  </p>
{/if}
