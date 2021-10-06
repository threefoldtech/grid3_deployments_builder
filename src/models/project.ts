import { v4 } from "uuid";
import type { Resource } from "./resource";

export class Project {
  constructor(
    public id = v4(),
    public name = "new_project",
    public resources: Resource[] = []
  ) {}
}
