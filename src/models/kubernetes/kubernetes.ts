import { v4 } from "uuid";
import { ResourceInterface } from "..";

import type { Master } from "./master";
import type { Worker } from "./worker";

export class Kubernetes implements ResourceInterface {
  constructor(
    readonly type: string = "kubernetes",
    public id = v4(),
    public name: string = "grid_deployment",
    public masters: Master[] = [],
    public workers: Worker[] = [],
    public secret: string = "password",
    public sshKey: string = "SSH_KEY",
    public metadata: string = "",
    public description: string = "",
    public isDeployed: boolean = false
  ) {}
}
