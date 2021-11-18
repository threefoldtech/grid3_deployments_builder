import { v4 } from "uuid";
import { ResourceInterface } from "..";

import type { Machine } from "./machine";

export class Machines implements ResourceInterface {
  constructor(
    readonly type: string = "machines",
    public id: string = v4(),
    public name: string = "",
    public machines: Machine[] = [],
    public description: string = "",
    public metadata: string = "",
    public isDeployed: boolean = false
  ) {}
}
