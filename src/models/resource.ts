import { v4 } from "uuid";
import type { VM } from "./vm";
import type { Master } from "./master";
import type { Worker } from "./worker";
import type { ZDB } from "./zdb";

export class Resource {
  constructor(
    public type: "machines" | "kubernetes" | "zdbs" = "machines",
    public id = v4(),
    public name: string = "grid_deployment",
    public vms: VM[] = [],
    public zdbs: ZDB[] = [],
    public masters: Master[] = [],
    public workers: Worker[] = [],
    public metadata: string = "",
    public description: string = "",
    // For Kubernetes
    public secret: string = "password",
    public sshKey: string = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDTwULSsUubOq3VPWL6cdrDvexDmjfznGydFPyaNcn7gAL9lRxwFbCDPMj7MbhNSpxxHV2+/iJPQOTVJu4oc1N7bPP3gBCnF51rPrhTpGCt5pBbTzeyNweanhedkKDsCO2mIEh/92Od5Hg512dX4j7Zw6ipRWYSaepapfyoRnNSriW/s3DH/uewezVtL5EuypMdfNngV/u2KZYWoeiwhrY/yEUykQVUwDysW/xUJNP5o+KSTAvNSJatr3FbuCFuCjBSvageOLHePTeUwu6qjqe+Xs4piF1ByO/6cOJ8bt5Vcx0bAtI8/MPApplUU/JWevsPNApvnA/ntffI+u8DCwgP",
    // For check if deployed
    public isDeployed: boolean = false
  ) {}
}
