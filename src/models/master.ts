import { v4 } from "uuid";

export class Master {
  constructor(
    public id = v4(),
    public diskSize = 23,
    public node = 2,
    public name = "mr",
    public cpu = 2,
    public publicip = true,
    public memory = 2048
  ) {}
}
