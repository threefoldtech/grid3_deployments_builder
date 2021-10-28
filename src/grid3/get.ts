import { GridClient } from "grid3_client_ts";
import { Project } from "src/models";

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

export async function getQsfsZdbs(gridClient: GridClient, deploymentName: string) {
  return await gridClient.qsfs_zdbs.getZdbs(deploymentName);
}

// export async function getGatewayFqdn(gridClient: GridClient, deploymentName: string){
//     return gridClient.gateway.getObj(deploymentName);
// }

export async function getProjectResult(
  gridClient: GridClient,
  project: Project
) {
  let projectResult = {
    machines: [],
    kubernetes: [],
    zdbs: [],
    qsfs_zdbs: [],
    gateway_fqdn: [],
    gateway_name: [],
  };
  let result;
  for (const resource of project.resources){
    if (resource.isDeployed) {
      switch (resource.type) {
        case "machines":
          result = await getMachines(gridClient, resource.name);
          projectResult.machines.push({[resource.name]:result});
          break;
        case "kubernetes":
          result = await getKubernetes(gridClient, resource.name);
          projectResult.kubernetes.push({[resource.name]:result});
          break;
        case "zdbs":
          result = await getZdbs(gridClient, resource.name);
          projectResult.zdbs.push({[resource.name]:result});
          break;
        case "qsfsZdbs":
          result = await getQsfsZdbs(gridClient, resource.name);
          projectResult.qsfs_zdbs.push({[resource.name]:result});
          break;
        case "fqdn":
          break;
        case "name":
          break;
      }
    }
  };
  return projectResult;
}
