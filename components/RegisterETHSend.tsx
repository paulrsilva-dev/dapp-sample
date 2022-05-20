import { BigNumber } from "@ethersproject/bignumber";
import { useEffect, useState } from "react";
import DateTimePicker from 'react-datetime-picker/dist/entry.nostyle';
import 'react-calendar/dist/Calendar.css'; import 'react-clock/dist/Clock.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import { BURN_ADDRESS, ETH_SENDER_ADDRESS } from "../constants/addresses";
import { getRegisterETHSendCallData } from "../hooks/useRegisterETHSend";
import Registry_ABI from "../contracts/RegistryABI.json";
import type { RegistryABI } from "../contracts/types";
import { REGISTRY_CONTRACT_ADDRESS } from "../constants/addresses";
import { parseEther } from "@ethersproject/units";
import useContract from "../hooks/useContract";

const useRegistryContract = () => {
  return useContract<RegistryABI>(REGISTRY_CONTRACT_ADDRESS, Registry_ABI);
}

const RegisterETHSend = () => {
  const [ethAmount, setEthAmount] = useState("");
  const [dateTimeValue, setDateTimeValue] = useState(new Date());
  const [time, setTime] = useState<BigNumber>();
  const [receiverAddress, setReceiverAddress] = useState("");
  const [callData, setCallData] = useState("");
  const contract = useRegistryContract();

  const useRegisterETHSend = async (callData, ethForCall) => {
    // The additional 0.01 ETH in `payableValue` is for the bot to execute the transaction
    const payableValue = parseEther((parseFloat(ethForCall)+0.01).toString());

    if (contract) {
      await contract
        .newReq(
          ETH_SENDER_ADDRESS,
          BURN_ADDRESS,
          callData,
          parseEther(ethForCall),
          false,
          false,
          false,
          {
            value: payableValue
          }
        )
        .then(response => {
          console.log("response", response);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  useEffect(() => {
    if (time && receiverAddress) {
      // get call data when both time and receiverAddress are changed by user input
      // no checking for validity of receiver address input because this is just a poc
      const _callData = getRegisterETHSendCallData(time, receiverAddress);
      setCallData(_callData);
    }
  }, [time, receiverAddress]);

  useEffect(() => {
    // save timestamp in ms as BigNumber for contract call
    setTime(BigNumber.from(new Date(dateTimeValue).getTime()));
  }, [dateTimeValue]);

  return (
    <div className="form">
      <div className="form-row">
        <span>Amount of ETH to send</span>
        <input type="number" onChange={(event) => setEthAmount(event.target.value)}></input>
      </div>
      <div className="form-row">
        <span>Date and time of future transaction</span>
        <DateTimePicker
          value={dateTimeValue}
          onChange={value => setDateTimeValue(value)}/>
      </div>
      <div className="form-row">
        <span>Receiver Address</span>
        <input onChange={(event) => setReceiverAddress(event.target.value)}></input>
      </div>
      <button className="submit-button" onClick={() => useRegisterETHSend(callData, ethAmount)}>Submit</button>
    </div>
  );
};

export default RegisterETHSend;
