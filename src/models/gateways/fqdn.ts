import { v4 } from "uuid";
import { ResourceInterface } from "..";

export class GatewayFQDN implements ResourceInterface {
  constructor(
    readonly type = "fqdn",
    public id = v4(),
    public node: number = 2,
    public name: string = "gatewayfqdn",
    public domain: string = "",
    public tlsPassThrough: boolean = false,
    public backends: string[] = ["backend1"],
    public description: string = "",
    public metadata: string = "",
    public isDeployed: boolean = false
  ) {}
}
