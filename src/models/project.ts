import { v4 } from "uuid";
import type { Resource } from "./resource";
import { Network } from "./network";

export class Project {
  constructor(
    public id = v4(),
    public name = "new_project",
    public network: Network | null = new Network(),
    public resources: Resource[] = []
  ) {}
}
