// import { contractAddress, contractAbi } from "@/contracts/voting-abi";
// import { use } from "@maticnetwork/maticjs";
// import { Web3ClientPlugin } from "@maticnetwork/maticjs-web3";
// import { BigNumber } from "ethers";
// import { Web3 } from "web3";

// use(Web3ClientPlugin);

// export async function GET() {
//   return Response.json(await get());
// }

// const get = async () => {
//   var web3 = new Web3(
//     new Web3.providers.HttpProvider(process.env.API_URL ?? "")
//   );

//   const contractInstance = new web3.eth.Contract(contractAbi, contractAddress);

//   const candidatesList: { name: string; voteCount: BigNumber }[] =
//     await contractInstance.methods.getAllVotesOfCandiates().call();

//   const formattedCandidates = candidatesList.map(
//     (candidate: { name: string; voteCount: BigNumber }, index: number) => {
//       return {
//         id: index,
//         name: candidate.name,
//         voteCount: Number(candidate.voteCount.toString()),
//       };
//     }
//   );

//   return formattedCandidates;
// };

export async function GET() {
  return Response.json([]);
}
