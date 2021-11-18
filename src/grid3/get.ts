import { HTTPMessageBusClient } from "ts-rmb-http-client";
import { GridClient } from "grid3_client";
import { Project } from "src/models";

export async function getClient(mnemStore, projectName): Promise<GridClient> {
  const { networkEnv, mnemonics, kvSecret } = mnemStore;
  const rmb = new HTTPMessageBusClient(0, "");
  const grid = new GridClient(networkEnv, mnemonics, kvSecret, rmb, projectName);
  await grid.connect();
  return grid;
}

export async function getMachines(
  gridClient: GridClient,
  deploymentName: string
) {
  return await gridClient.machines.getObj(deploymentName);
}

export async function getKubernetes(
  gridClient: GridClient,
  deploymentName: string
) {
  return await gridClient.k8s.getObj(deploymentName);
}

export async function getZdbs(gridClient: GridClient, deploymentName: string) {
  return await gridClient.zdbs.getObj(deploymentName);
}

export async function getQsfsZdbs(
  gridClient: GridClient,
  deploymentName: string
) {
  return await gridClient.qsfs_zdbs.getZdbs(deploymentName);
}

export async function getDomain(
  gridClient: GridClient,
  deploymentName: string
) {
  return gridClient.gateway.getObj(deploymentName);
}

export async function getProjectResult(
  gridClient: GridClient,
  project: Project
) {
  let projectResult = {
    machines: [],
    kubernetes: [],
    zdbs: [],
    qsfs_zdbs: [],
    domains: [],
    prefix_domains: [],
  };
  let result;
  for (const resource of project.resources) {
    if (resource.isDeployed) {
      switch (resource.type) {
        case "machines":
          result = await getMachines(gridClient, resource.name);
          projectResult.machines.push({ [resource.name]: result });
          break;
        case "kubernetes":
          result = await getKubernetes(gridClient, resource.name);
          projectResult.kubernetes.push({ [resource.name]: result });
          break;
        case "zdbs":
          result = await getZdbs(gridClient, resource.name);
          projectResult.zdbs.push({ [resource.name]: result });
          break;
        case "qsfsZdbs":
          result = await getQsfsZdbs(gridClient, resource.name);
          projectResult.qsfs_zdbs.push({ [resource.name]: result });
          break;
        case "fqdn":
          result = await getDomain(gridClient, resource.name);
          projectResult.domains.push({ [resource.name]: result });
        case "name":
          result = await getDomain(gridClient, resource.name);
          projectResult.prefix_domains.push({ [resource.name]: result });
      }
    }
  }
  gridClient.disconnect();
  return projectResult;
}
