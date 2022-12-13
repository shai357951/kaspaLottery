import React, { useState, useEffect } from "react";

import logo from "./logo.svg";
import "./App.css";

const arryOfUnreleventAddress=["kaspa:qqdrup00lf7ge4j5cgs3j22nvlt89d4r70pkl66dxp55zrkvl90fs4unakh9e",
"kaspa:qpzfjcxhp9gsx7l4kv0zpyp7m9e730tq0g5twy6zwufxkwlcmp7s55527035t",
"kaspa:qzgfzj7mjrk5z5yz4usjc7tndk3sy2zglnd662jkjyfyx7dv3smfxjuue4306"]

async function getAllTransctoins(address) {

  const res = await fetch(
    `https://api.kaspa.org/addresses/${address}/transactions`
  );
  const transactions = await res.json();

  const txsReceived = transactions.transactions.map(tx => tx.tx_received);

  return txsReceived;
}
function getAllSenderAndAmount(txsData){
  const allTxReleventOutPut = []
  const allOutPuts = getAllOutPuts(txsData)
  allOutPuts.forEach(outPut=>allTxReleventOutPut.push
    ({senderAddress:getTxSenderAddress(outPut),amount:getTxAmount(outPut)}))
    return removeUnreleventAddress(allTxReleventOutPut)

}

async function getAllTransctoinsData(address) {

  const allTtxsReceived = await getAllTransctoins(address);

  const res = await fetch("https://api.kaspa.org/transactions/search", {
    method: "POST",
    body: JSON.stringify({
      transactionIds: allTtxsReceived
    }),

    headers: {
      "Content-Type": "application/json",
      accept: "application/json"
    }
  });
  const data = await res.json();
return data


}
function removeUnreleventAddress(allSanderAddress){
  const relventAddress=[]
  allSanderAddress.forEach(addressAndAmount=>{
    const senderAddress =  addressAndAmount.senderAddress
    let quary = true
    arryOfUnreleventAddress.forEach((address,i)=>{
      if(senderAddress==address)
      quary = false
    })
   if(quary){
    relventAddress.push(addressAndAmount)
   }
  })
  return relventAddress
}
function getTxSenderAddress (txOutPuts){
  let senderAddress = txOutPuts[1].script_public_key_address

  return senderAddress
  }
function getTxAmount (txOutPuts){
let amount = txOutPuts[0].amount

return amount/100000000
}
function getAllOutPuts(txsData){
  const allOutPuts = txsData.map(txData=>txData.outputs)
  return allOutPuts
}

function getAllTickets (data){
 const allSenderAndAmount= getAllSenderAndAmount(data)
 const allTicketsOverView = []
 const leftOvers = []
 allSenderAndAmount.forEach(senderAndAmount=>{
  const ticketsAmount = Math.floor(senderAndAmount.amount /100)
  if(ticketsAmount>0){
    allTicketsOverView.push({senderAddress:senderAndAmount.senderAddress,tickets:ticketsAmount} )

  }
const leftOver =senderAndAmount.amount/100%1*100
if(leftOver>0){
  leftOvers.push({senderAddress:senderAndAmount.senderAddress,amount:senderAndAmount.amount})
}
 })
 const tickets = []
 allTicketsOverView.forEach(ticket=>{
  let i =0
  for (i;i<ticket.tickets;i++){
    tickets.push(ticket.senderAddress)
  }
 })
 return { tickets, leftOvers}
}
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function chooseRandomsFromArry(arry){
  const arryIndex = getRandomInt(arry.length)
  return arryIndex 
}
async function  lottery (address){
  const data = await getAllTransctoinsData(address)
  const leftOver = getAllTickets(data).leftOvers
  const howManyWiners = 3
  const allWinners = []
  for (var i = 0;i<howManyWiners;i++){
   const tickets = getAllTickets(data).tickets
   const winner =  tickets[chooseRandomsFromArry(tickets)]
   allWinners.push(winner)
   arryOfUnreleventAddress.push(winner)
  }
 console.log("allWinners",allWinners)
 console.log("leftOver",leftOver)
 return allWinners

}


function App() {
  const [firstPalce,setFirstPalce] = useState("")
  const [secondPalce,setSecondPalce] = useState("")
  const [thirdPalce,setThirdPalce] = useState("")




  return (
    <div className="App">
<div>
  <div>first place</div>
  <div>{firstPalce}</div>
</div>
<div>
<div>second place</div>

<div>{secondPalce}</div>
</div>
<div>
<div>third place</div>

<div>{thirdPalce}</div>
</div>

<button onClick={async ()=>{
  const allWinners = await    lottery(
    "kaspa:qqdrup00lf7ge4j5cgs3j22nvlt89d4r70pkl66dxp55zrkvl90fs4unakh9e"
  )
      console.log("aaaa",allWinners)
      setFirstPalce(allWinners[0])
      setSecondPalce(allWinners[1])
      setThirdPalce(allWinners[2])


}}>Lottery</button>
    </div>
  );
}

export default App;
