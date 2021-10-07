import { v4 } from "uuid";

export class Worker {
  constructor(
    public id = v4(),
    public diskSize = 15,
    public node = 2,
    public name = "w0",
    public cpu = 2,
    public memory = 2048,
    public publicIp = false
  ) {}
}
