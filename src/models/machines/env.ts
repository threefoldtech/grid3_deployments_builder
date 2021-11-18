import { v4 } from "uuid";

export class Env {
  constructor(
    public id: string = v4(),
    public key: string = "",
    public value: string = "",
    public isDeployed: boolean = false
  ) {}
}
