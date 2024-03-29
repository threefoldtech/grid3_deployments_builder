import { v4 } from "uuid";
import { ResourceInterface } from "..";

import type { Master } from "./master";
import type { Worker } from "./worker";

export class Kubernetes implements ResourceInterface {
  constructor(
    readonly type: string = "kubernetes",
    public id = v4(),
    public name: string = "",
    public kubeNodes: (Master | Worker)[] = [],
    public secret: string = "",
    public sshKey: string = "",
    public metadata: string = "",
    public description: string = "",
    public isDeployed: boolean = false
  ) {}
}
