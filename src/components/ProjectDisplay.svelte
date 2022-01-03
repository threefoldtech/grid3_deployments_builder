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
  import ConfirmMsg from "./base/ConfirmMsg.svelte";
  import {
    deleteMachine,
    deleteResource,
    deleteWorker,
    deleteZdb,
    getClient,
  } from "src/grid3";
  import QsfsZdbsDisplay from "./zdbs/QsfsZdbsDisplay.svelte";
  import QsfsDiskDisplay from "./machines/QSFSDiskDisplay.svelte";
  import { Machine, Resource, Worker, ZDB } from "src/models";
  import { onMount } from "svelte";

  $: store = $codeStore;
  $: idx = store.active;
  $: project = store.projects[idx];
  $: mnemStore = $mnemonicsStore;
  let _kv;
  let _mnem;
  let _nenv;
  let _projectName;

  onMount(async () => {
    if (project) {
      project.gridClient = await getClient(mnemStore, project.name);
      _projectName = project.name;
    }
    _kv = mnemStore.kvSecret;
    _mnem = mnemStore.mnemonics;
    _nenv = mnemStore.networkEnv;
  });

  // To update the client if anything changed.
  $: {
    if (project == null){
      _projectName = null
    }else if (project && !project.rename && project.name !==_projectName){
      getClient(mnemStore, project.name).then((c) => (project.gridClient = c));
      _projectName = project.name;
    }else if (
      _kv &&
      _mnem &&
      _nenv &&
      (_kv !== mnemStore.kvSecret ||
        _mnem !== mnemStore.mnemonics ||
        _nenv !== mnemStore.networkEnv)
    ) {
      getClient(mnemStore, project.name).then((c) => (project.gridClient = c));
      _kv = mnemStore.kvSecret;
      _mnem = mnemStore.mnemonics;
      _nenv = mnemStore.networkEnv;
    }
  }

  // For Delete
  let onDelete: boolean = false;
  let deleteType: string = "element";
  let deleteDeployment: Resource;
  let deleteDeploymentId: number;
  let deleteElement: Machine | Worker | ZDB;
  let deleteElementId: number;
  let deleteMsg: string = "";
  const onShowDelete = (delType, dep, depId, element?, elementId?) => {
    deleteType = delType;
    deleteElement = element;
    deleteElementId = elementId;
    deleteDeployment = dep;
    deleteDeploymentId = depId;
    if (deleteType == "resource") {
      deleteMsg =
        "You are about to delete deployment#" + depId + ": " + dep.name;
    } else {
      deleteMsg =
        "You are about to delete element#" +
        elementId +
        ": " +
        element.name +
        " in deployment#" +
        depId +
        ": " +
        dep.name;
    }
    onDelete = true;
  };
  const confirmDeleteResource = (projectName) => {
    if (deleteType == "resource") {
      deleteResource(
        mnemStore,
        projectName,
        deleteDeployment,
        deleteDeploymentId
      );
    } else {
      if (deleteDeployment.type == "machines") {
        deleteMachine(
          mnemStore,
          projectName,
          deleteDeployment.name,
          deleteDeploymentId,
          deleteElement as Machine,
          deleteElementId
        );
      } else if (deleteDeployment.type == "kubernetes") {
        deleteWorker(
          mnemStore,
          projectName,
          deleteDeployment.name,
          deleteDeploymentId,
          deleteElement as Worker,
          deleteElementId
        );
      } else if (deleteDeployment.type == "zdbs") {
        deleteZdb(
          mnemStore,
          projectName,
          deleteDeployment.name,
          deleteDeploymentId,
          deleteElement as ZDB,
          deleteElementId
        );
      }
    }
    onDelete = false;
  };
  const onCloseDelete = () => {
    onDelete = false;
  };
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
          on:click={() => {
            onShowDelete("resource", resource, resourceIdx);
          }}
        >
          <!-- ---------------- Machines ---------------- -->
          {#if "machines" in resource}
            <MachinesDisplay machines={resource} idx={resourceIdx} />
            {#each resource.machines as vm, idx (vm.id)}
              <Droppable {resourceIdx} {idx}>
                <Block
                  color="--machine"
                  on:click={() => {
                    onShowDelete("element", resource, resourceIdx, vm, idx);
                  }}
                >
                  <MachineDisplay {project} {resourceIdx} {vm} {idx} />

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

                  {#each vm.qsfsDisks as qsfsDisk, qsfsDiskIdx (qsfsDisk.id)}
                    <Block
                      color="--qsfsDisk"
                      on:click={codeStore.removeFromVm(
                        resourceIdx,
                        idx,
                        "qsfsDisks",
                        qsfsDiskIdx
                      )}
                      removeable={!qsfsDisk.isDeployed}
                    >
                      <QsfsDiskDisplay
                        {...{
                          resourceIdx,
                          elementIdx: idx,
                          idx: qsfsDiskIdx,
                          qsfsDisk,
                        }}
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
          {:else if "kubeNodes" in resource}
            <KubernetesDisplay kubernetes={resource} idx={resourceIdx} />
            {#each resource.kubeNodes as node, i (node.id)}
              <Droppable {resourceIdx} idx={i}>
                {#if i == 0}
                  <Block color="--master" removeable={false}>
                    <MasterDisplay
                      {project}
                      {resourceIdx}
                      idx={i}
                      master={node}
                    />
                    {#each node.qsfsDisks as qsfsDisk, qsfsDiskIdx (qsfsDisk.id)}
                      <Block
                        color="--qsfsDisk"
                        on:click={codeStore.removeFromKubeNode(
                          resourceIdx,
                          i,
                          qsfsDiskIdx
                        )}
                        removeable={!qsfsDisk.isDeployed}
                      >
                        <QsfsDiskDisplay
                          {...{
                            resourceIdx,
                            elementIdx: i,
                            idx: qsfsDiskIdx,
                            qsfsDisk,
                          }}
                        />
                      </Block>
                    {/each}
                  </Block>
                {:else}
                  <Block
                    color="--worker"
                    on:click={() => {
                      onShowDelete("element", resource, resourceIdx, node, i);
                    }}
                  >
                    <WorkerDisplay
                      {project}
                      {resourceIdx}
                      idx={i}
                      worker={node}
                    />
                    {#each node.qsfsDisks as qsfsDisk, qsfsDiskIdx (qsfsDisk.id)}
                      <Block
                        color="--qsfsDisk"
                        on:click={codeStore.removeFromKubeNode(
                          resourceIdx,
                          i,
                          qsfsDiskIdx
                        )}
                        removeable={!qsfsDisk.isDeployed}
                      >
                        <QsfsDiskDisplay
                          {...{
                            resourceIdx,
                            elementIdx: i,
                            idx: qsfsDiskIdx,
                            qsfsDisk,
                          }}
                        />
                      </Block>
                    {/each}
                  </Block>
                {/if}
              </Droppable>
            {/each}

            <!-- ---------------- ZDBs ---------------- -->
          {:else if "zdbs" in resource}
            <ZdbsDisplay zdbs={resource} idx={resourceIdx} />
            {#each resource.zdbs as zdb, i (zdb.id)}
              <Block
                color="--zdb"
                on:click={() => {
                  onShowDelete("element", resource, resourceIdx, zdb, i);
                }}
              >
                <ZdbDisplay {project} {resourceIdx} {zdb} idx={i} />
              </Block>
            {/each}

            <!-- ---------------- Qsfs ZDBs ---------------- -->
          {:else if "qsfsZdbsType" in resource}
            <QsfsZdbsDisplay {project} qsfsZdbs={resource} idx={resourceIdx} />

            <!-- ---------------- FQDN Gateway ---------------- -->
          {:else if "domain" in resource}
            <GatewaysFqdDisplay
              {project}
              gatewayfq={resource}
              idx={resourceIdx}
            />

            <!-- ---------------- Name Gateway ---------------- -->
          {:else if "prefix" in resource}
            <GatewaysNameDisplay
              {project}
              gateway={resource}
              idx={resourceIdx}
            />
          {/if}
        </Block>
      </Droppable>
    </div>

    {#if onDelete}
      <ConfirmMsg
        msg={deleteMsg}
        confirmBtnDisplayText="Delete"
        onClickConfirm={confirmDeleteResource.bind(
          confirmDeleteResource,
          project.name
        )}
        onClickCancel={onCloseDelete}
      />
    {/if}
  {/each}
{:else}
  <p style="text-align: center; padding-top: 10rem; font-size: 2rem;">
    Please create or select a project.
  </p>
{/if}
