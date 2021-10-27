import { v4 } from "uuid";

export class Disk {
  constructor(
    public id: string = v4(),
    public name: string = "",
    public size: number = 2,
    public mount: string = "",
    public description: string = "",
    public isDeployed: boolean = false
  ) {}
}
