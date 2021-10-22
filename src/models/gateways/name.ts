import { v4 } from "uuid";
import { ResourceInterface } from "..";

export class GatewayName implements ResourceInterface {
  constructor(
    readonly type: string = "name",
    public id: string = v4(),
    public node: number = 2,
    public name: string = "NameGateway Deployment",
    public nameGateway: string = "gateway",
    public tlsPassThrough: boolean = false,
    public backends: string[] = ["backend1"],
    public description: string = "",
    public metadata: string = "",
    public isDeployed: boolean = false
  ) {}
}
