import { v4 } from "uuid";
import { ResourceInterface } from "..";

export class GatewayName implements ResourceInterface {
  constructor(
    readonly type: string = "name",
    public id: string = v4(),
    public node: number = 0,
    public name: string = "",
    public prefix: string = "",
    public tlsPassThrough: boolean = false,
    public backends: string[] = [],
    public description: string = "",
    public metadata: string = "",
    public isDeployed: boolean = false
  ) {}
}
