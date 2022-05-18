import { Interface } from "@ethersproject/abi";
import Eth_Sender_ABI from "../contracts/ETHSenderABI.json";

export function getRegisterETHSendCallData(time, userAddress) {
  const ETH_SENDER_INTERFACE = new Interface(Eth_Sender_ABI);
  const fragment = ETH_SENDER_INTERFACE.getFunction("sendEthAtTime");
  const callData = ETH_SENDER_INTERFACE.encodeFunctionData(fragment, [time, userAddress]);

  return callData;
}