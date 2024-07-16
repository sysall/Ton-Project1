import {hex} from "../build/main.compiled.json";
import { beginCell, Cell, contractAddress, StateInit, storeStateInit, toNano } from "@ton/core";
import qs from "qs";
import qrcode from "qrcode-terminal";
import dotenv from "dotenv"
dotenv.config();

async function deployScript() {
    console.log(
        "================================================================="
    );
    console.log("Deploy script is running, let's deploy our main.fc contract...");
    //Calculate the future address of the contract
    const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];
    const dataCell = new Cell();

    //Compose an initial state of the contract (code and initial data)
    const stateInit: StateInit = {
        code: codeCell,
        data: dataCell
    };

    //Compose a message that will carry the initial state
    const stateInitBuilder = beginCell();
    storeStateInit(stateInit)(stateInitBuilder);
    const stateInitCell = stateInitBuilder.endCell();

    //Send the composed message to the future addres of the contract on blockchain
    const address = contractAddress(0, {
        code: codeCell,
        data:dataCell
    });

    console.log(
        `The address of the contract is following: ${address.toString()}`
    );
    console.log(`Please scan the QR code below to deploy the contract to ${process.env.TESTET ? "tesnet" : "mainnet"}`);

    let link =
        `https://tonhub.com/transfer/` +
        address.toString({
            testOnly: process.env.TESTNET ? true : false,
        }) + "?" +
        qs.stringify({
            text: "Deploy contract",
            amount: toNano(1).toString(10),
            init: stateInitCell.toBoc({ idx: false }).toString("base64"),
        });

    qrcode.generate(link, { small: true }, (code) => {
        console.log(code);
    });
}
deployScript();