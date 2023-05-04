import {
    RobustSwapETHForSpecificNFTsCall,
    SwapETHForSpecificNFTsCall,
    SwapNFTsForTokenCall,
    RobustSwapNFTsForTokenCall,
} from "../generated/templates/LSSVMPairEnumerableETH/LSSVMRouter"


import {
    Trade,
    test,
} from "../generated/schema"
import { BigInt, ethereum, } from '@graphprotocol/graph-ts'


export class SwapInfo {
    tokenIds: BigInt[];
    minOutput: BigInt;
    constructor(tokenIds: BigInt[], minOutput: BigInt) {
        this.tokenIds = tokenIds;
        this.minOutput = minOutput;
    }
}



export class SwapInfo1 {
    tokenIds: BigInt[];
    constructor(tokenIds: BigInt[]) {
        this.tokenIds = tokenIds;
    }
}



class RobustPairSwapSpecificForToken1 {
    swapInfo: ethereum.Tuple;
    maxCost: BigInt;

    constructor(swapInfo: ethereum.Tuple, maxCost: BigInt) {
        this.swapInfo = swapInfo;
        this.maxCost = maxCost;
    }
}

export function handleRobustSwapETHForSpecificNFTs(
    call: RobustSwapETHForSpecificNFTsCall
): void {
    let inputs = call.inputs.swapList;
    let swapList: RobustPairSwapSpecificForToken1[] = inputs.map<RobustPairSwapSpecificForToken1>((tuple) => {
        let swapInfo = tuple[0].toTuple();
        let maxCost = tuple[1].toBigInt();
        return new RobustPairSwapSpecificForToken1(swapInfo, maxCost);
    });

    let trades = Trade.load(call.transaction.hash.toHexString());
    if (trades === null) {
        trades = new Trade(call.transaction.hash.toHexString());
    }
    if (trades.buyer === null) {
        trades.buyer = "0x00";
    }
    if (trades.seller === null) {
        trades.buyer = "0x00";
    }
    if (trades.collection === null) {
        trades.buyer = "0x00";
    }
    let allTokenIds: BigInt[] = [];
    for (let i = 0; i < swapList.length; i++) {
        let tokenIds = swapList[i].swapInfo[1].toBigIntArray() as BigInt[];
        allTokenIds = allTokenIds.concat(tokenIds);
    }


    trades.token_id = allTokenIds;
    trades.amount = BigInt.fromI32(allTokenIds.length);
    trades.amount_usd = call.transaction.value;
    trades.save();

    let tests = test.load(call.transaction.hash.toHexString());
    if (tests === null) {
        tests = new test(call.transaction.hash.toHexString());
    }

    tests.test_amount_usd = call.transaction.value;
    tests.save();
}



export function handleSwapETHForSpecificNFTs(call: SwapETHForSpecificNFTsCall): void {
    let inputs = call.inputs.swapList;
    let swapList: SwapInfo[] = [];

    for (let i = 0; i < inputs.length; i++) {
        let tuple = inputs[i] as ethereum.Tuple;
        let tokenIds: BigInt[] = [tuple[0].toTuple()[1].toBigInt()];
        let minOutput: BigInt = tuple[1].toBigInt();
        swapList.push(new SwapInfo(tokenIds, minOutput));
    }

    let trades = Trade.load(call.transaction.hash.toHexString());
    if (trades === null) {
        trades = new Trade(call.transaction.hash.toHexString());
    }
    if (trades.buyer === null) {
        trades.buyer = "0x00";
    }
    if (trades.seller === null) {
        trades.buyer = "0x00";
    }
    if (trades.collection === null) {
        trades.buyer = "0x00";
    }
    let allTokenIds: BigInt[] = [];
    let allMinOutputs: BigInt[] = [];
    for (let i = 0; i < swapList.length; i++) {
        let swapInfo = swapList[i];
        allTokenIds = allTokenIds.concat(swapInfo.tokenIds);
        allMinOutputs.push(swapInfo.minOutput);
    }

    trades.token_id = allTokenIds
    trades.amount = BigInt.fromI32(1)
    trades.amount_usd = call.transaction.value

    let tests = test.load(call.transaction.hash.toHexString())
    if (tests === null) {
        tests = new test(call.transaction.hash.toHexString())
    }

    tests.test_amount_usd = call.transaction.value

    tests.save()
    trades.save()
}


export function handleSwapNFTsForToken(call: SwapNFTsForTokenCall): void {

    let inputs = call.inputs.swapList
    let swapList: SwapInfo1[] = []
    for (let i = 0; i < inputs.length; i++) {
        let tuple = inputs[i]
        let tokenIds: BigInt[] = [tuple[1].toBigInt()]
        swapList.push(new SwapInfo1(tokenIds))
    }

    let trades = Trade.load(call.transaction.hash.toHexString())
    if (trades === null) {
        trades = new Trade(call.transaction.hash.toHexString())
    }
    if (trades.buyer === null) {
        trades.buyer = "0x00";
    }
    if (trades.seller === null) {
        trades.buyer = "0x00";
    }
    if (trades.collection === null) {
        trades.buyer = "0x00";
    }
    // 从swapList中连接所有tokenIds到一个名为allTokenIds的单一数组
    let allTokenIds: BigInt[] = []
    for (let i = 0; i < swapList.length; i++) {
        let swapInfo = swapList[i]
        allTokenIds = allTokenIds.concat(swapInfo.tokenIds)
    }

    trades.token_id = allTokenIds
    trades.amount = BigInt.fromI32(1)
    trades.amount_usd = call.inputs.minOutput


    trades.save()

    let tests = test.load(call.transaction.hash.toHexString())
    if (tests === null) {
        tests = new test(call.transaction.hash.toHexString())
    }

    tests.test_amount_usd = call.transaction.value

    tests.save()

}


export function handleRobustSwapNFTsForToken(call: RobustSwapNFTsForTokenCall): void {
    let inputs = call.inputs.swapList;
    let swapList: RobustPairSwapSpecificForToken1[] = inputs.map<RobustPairSwapSpecificForToken1>((tuple) => {
        let swapInfo = tuple[0].toTuple();
        let maxCost = tuple[1].toBigInt();
        return new RobustPairSwapSpecificForToken1(swapInfo, maxCost);
    });

    let trades = Trade.load(call.transaction.hash.toHexString());
    if (trades === null) {
        trades = new Trade(call.transaction.hash.toHexString());
    }
    if (trades.buyer === null) {
        trades.buyer = "0x00";
    }
    if (trades.seller === null) {
        trades.buyer = "0x00";
    }
    if (trades.collection === null) {
        trades.buyer = "0x00";
    }
    let allTokenIds: BigInt[] = [];
    for (let i = 0; i < swapList.length; i++) {
        let tokenIds = swapList[i].swapInfo[1].toBigIntArray() as BigInt[];
        allTokenIds = allTokenIds.concat(tokenIds);
    }


    trades.token_id = allTokenIds;
    trades.amount = BigInt.fromI32(allTokenIds.length);
    trades.amount_usd = call.transaction.value;
    trades.save();

    let tests = test.load(call.transaction.hash.toHexString());
    if (tests === null) {
        tests = new test(call.transaction.hash.toHexString());
    }

    tests.test_amount_usd = call.transaction.value;
    tests.save();
}
