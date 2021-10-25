import { HTTPMessageBusClient } from "ts-rmb-http-client";
import { GridClient } from "grid3_client_ts";

export function getClient(mnemStore, projectName): GridClient {
  const { twinId, explorerUrl, mnemonics, proxyUrl } = mnemStore;
  const rmb = new HTTPMessageBusClient(+twinId, proxyUrl);
  const grid = new GridClient(+twinId, explorerUrl, mnemonics, rmb, projectName);
  return grid;
}
