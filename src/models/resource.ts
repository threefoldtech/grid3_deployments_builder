import { v4 } from "uuid";
import type { VM } from "./vm";
import type { Master } from "./master";
import type { Worker } from "./worker";
import type { ZDB } from "./zdb";

export class Resource {
  constructor(
    public type: "network" | "deployment" | "kubernetes" = "deployment",
    public id = v4(),
    public title: string = "d1",
    public name: string = "grid_deployment",
    public node: number = 2,
    public vms: VM[] = [],
    public zdbs: ZDB[] = [],
    public masters: Master[] = [],
    public workers: Worker[] = []
  ) {}
}
