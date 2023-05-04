import { BigInt } from "@graphprotocol/graph-ts"
import {
  NewPair as NewPairEvent,
  CreatePairETHCall
} from "../generated/LSSVMPairFactory/LSSVMPairFactory"
import { NewPair, Pair } from "../generated/schema"
import { LSSVMPairEnumerableETH } from "../generated/templates"


export function handleCreatePairETH(
  event: CreatePairETHCall
): void {
  let newPair = NewPair.load(event.transaction.hash.toHexString())
  if (!newPair) {
    newPair = new NewPair(event.transaction.hash.toHexString())
  }
  newPair.nft = event.inputs._nft.toHexString()
  newPair.initialBondingCurveAddress = event.inputs._bondingCurve.toHexString()
  newPair.initialAssetRecipient = event.inputs._assetRecipient.toHexString()
  newPair.poolType = BigInt.fromI32(event.inputs._poolType)
  newPair.initialDelta = event.inputs._delta
  newPair.initialFee = event.inputs._fee
  newPair.initialSpotPrice = event.inputs._spotPrice
  newPair.initialNFTIdInventory = event.inputs._initialNFTIDs
  newPair.initialInventoryCount = BigInt.fromI32(event.inputs._initialNFTIDs.length)
  newPair.initialETHLiquidity = event.transaction.value
  newPair.owner = event.from.toHexString()
  newPair.save()

}

export function handleNewPairEvent(event: NewPairEvent): void {
  LSSVMPairEnumerableETH.create(event.params.poolAddress)
  let pair = Pair.load(event.transaction.hash.toHexString())
  if (!pair) {
    pair = new Pair(event.params.poolAddress.toHexString())
  }

  pair.createdAt = event.block.timestamp
  pair.updatedAt = event.block.timestamp
  pair.createdTx = event.transaction.hash.toHexString()
  pair.owner = event.transaction.from.toHexString()
  pair.initialAttributes = event.transaction.hash.toHexString()
  pair.save()
}