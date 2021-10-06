import { v4 } from "uuid";
import type { Resource } from "./resource";
import type { Network } from "./network";
import type { ZDB } from "./zdb";

export class Project {
  constructor(
    public id = v4(),
    public name = "new_project",
    public network: Network | null = null,
    public zdbs: ZDB[] = [],
    public resources: Resource[] = []
  ) {}
}
