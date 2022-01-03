import { v4 } from "uuid";
import type { Resource } from "./resource";
import { Network } from "./network";
import type { GridClient } from "grid3_client";

export class Project {
  constructor(
    public id = v4(),
    public name: string = "new_project",
    public network: Network | null = new Network(),
    public resources: Resource[] = [],
    public rename: boolean = false,
    public gridClient: GridClient = undefined
  ) {}
}
