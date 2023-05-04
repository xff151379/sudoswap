import {
  SpotPriceUpdate as SpotPriceUpdateEvent,
  SwapNFTInPair as SwapNFTInPairEvent,
  SwapNFTOutPair as SwapNFTOutPairEvent,
  SwapTokenForSpecificNFTsCall,
} from "../generated/templates/LSSVMPairEnumerableETH/LSSVMPairEnumerableETH"




import {
  NewPair,
  Pair,
  SpotPriceUpdate,
  Trade,
  test,
} from "../generated/schema"
import { Address, BigInt } from '@graphprotocol/graph-ts'


export class SwapInfo {
  poolAddress: Address
  tokenIds: BigInt[]

  constructor(poolAddress: Address, tokenIds: BigInt[]) {
    this.poolAddress = poolAddress
    this.tokenIds = tokenIds
  }
}

export function handleSwapTokenForSpecificNFTs(call: SwapTokenForSpecificNFTsCall): void {

  let trades = Trade.load(call.transaction.hash.toHexString())
  if (trades === null) {
    trades = new Trade(call.transaction.hash.toHexString())
  }
  trades.token_id = call.inputs.nftIds
  trades.amount_usd = call.inputs.maxExpectedTokenInput
  trades.amount = BigInt.fromI32(1)
  trades.save()

  let tests = test.load(call.transaction.hash.toHexString())
  if (tests === null) {
    tests = new test(call.transaction.hash.toHexString())
  }

  tests.test_amount_usd = call.transaction.value

  tests.save()
}



// export function handleRobustSwapTokensForSpecificNFTsAndNFTsToToken(call: RobustSwapTokensForSpecificNFTsAndNFTsToTokenCall): void {
//   // resetGlobalVariables()
//   // currentEvent = "RobustSwapTokensForSpecificNFTsAndNFTsToToken"
//   // currentBuyer = event.inputs.params.nftToTokenTrades[0].toString()

//   let trades = new Trade(call.transaction.hash.toHexString())
//   trades.token_id = BigInt.fromI32(call.inputs.params.nftToTokenTrades[1])
//   trades.amount_usd = call.inputs.params.nftToTokenTrades[2]
//   trades.amount = BigInt.fromI32(1)
//   trades.save();

// }


export function handleSpotPriceUpdate(event: SpotPriceUpdateEvent): void {
  let entity = new SpotPriceUpdate(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.newSpotPrice = event.params.newSpotPrice
  entity.updateTx = event.transaction.hash.toHexString()
  entity.pair = event.address.toHexString()
  entity.timestamp = event.block.timestamp
  let pair = Pair.load(event.address.toHexString())!
  updatePairAttributesIfMissing(pair)
  if (pair) {
    pair.spotPrice = event.params.newSpotPrice
    pair.updatedAt = event.block.timestamp
    pair.save()
    entity.nft = pair.nft
  }
  entity.save()
}

export function handleSwapNFTInPair(event: SwapNFTInPairEvent): void {
  let trades = Trade.load(event.transaction.hash.toHexString())
  if (trades === null) {
    trades = new Trade(event.transaction.hash.toHexString())
    trades.token_id = [BigInt.fromI32(0)]
    trades.amount = BigInt.fromI32(0)
    trades.amount_usd = BigInt.fromI32(0)
  }

  let pair = Pair.load(event.address.toHexString())!

  updatePairAttributesIfMissing(pair)

  pair.inventoryCount = pair.inventoryCount!.plus(BigInt.fromI32(1))

  trades.buyer = event.address.toHexString()
  trades.seller = event.transaction.from.toHexString()
  trades.collection = pair.nft!


  trades.save()


}



export function handleSwapNFTOutPair(event: SwapNFTOutPairEvent): void {

  let trades = Trade.load(event.transaction.hash.toHexString())
  if (trades === null) {
    trades = new Trade(event.transaction.hash.toHexString())
    trades.token_id = [BigInt.fromI32(0)]
    trades.amount = BigInt.fromI32(0)
    trades.amount_usd = BigInt.fromI32(0)
  }

  let pair = Pair.load(event.address.toHexString())!
  updatePairAttributesIfMissing(pair)
  pair.inventoryCount = pair.inventoryCount!.minus(BigInt.fromI32(1))


  trades.buyer = event.transaction.from.toHexString()
  trades.seller = event.address.toHexString()
  trades.collection = pair.nft!


  trades.save()

}

export function updatePairAttributesIfMissing(pair: Pair): void {
  if (!pair.spotPrice) {
    let newPair = NewPair.load(pair.createdTx!)

    if (newPair) {
      pair.assetRecipient = pair.assetRecipient || newPair.initialAssetRecipient || ""
      pair.bondingCurveAddress = pair.bondingCurveAddress || newPair.initialBondingCurveAddress || ""
      pair.delta = pair.delta || newPair.initialDelta || BigInt.fromI32(0)
      pair.fee = pair.fee || newPair.initialFee || BigInt.fromI32(0)
      pair.inventoryCount = pair.inventoryCount || newPair.initialInventoryCount || BigInt.fromI32(0)
      pair.nft = pair.nft || newPair.nft || ""
      pair.owner = pair.owner || newPair.owner || ""
      pair.poolType = pair.poolType || newPair.poolType
      pair.spotPrice = pair.spotPrice || newPair.initialSpotPrice || BigInt.fromI32(0)
      pair.ethLiquidity = pair.ethLiquidity || newPair.initialETHLiquidity || BigInt.fromI32(0)
      pair.save()
    } else {
    }
  }
}
