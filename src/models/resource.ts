import type { Machines, ZDBs, Kubernetes, GatewayFQDN, GatewayName, QsfsZDBs } from ".";

export interface ResourceInterface {
  type: string
  id: string
  name: string
  description: string
  metadata: string
  isDeployed: boolean
}

export type Resource =   Machines | ZDBs | Kubernetes | GatewayFQDN | GatewayName | QsfsZDBs;
