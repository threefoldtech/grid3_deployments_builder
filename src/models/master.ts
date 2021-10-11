import { v4 } from "uuid";

export class Master {
  constructor(
    public id = v4(),
    public diskSize = 23,
    public node = 2,
    public name = "mr",
    public cpu = 2,
    public publicIp = true,
    public memory = 2048,
    public rootFsSize: number = 1,
    public planetary: boolean = false
  ) {}
}
