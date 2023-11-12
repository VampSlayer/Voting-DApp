import { Vote } from "@/components/vote";

const get = async () => {
  const VotingServerClient = (await import("../clients/voting-server")).default;
  return new VotingServerClient().getVotingState();
};

export default async function Page() {
  const votingState = await get();

  return (
    <main className="container">
      <div className="row justify-content-md-center">
        <div className="col">
          <div className="text-center">
            <h1>Voting DApp powered by Polygon</h1>
          </div>
        </div>
      </div>
      <Vote {...votingState}></Vote>
    </main>
  );
}
