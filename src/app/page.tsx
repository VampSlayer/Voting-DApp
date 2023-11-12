import { Vote } from "@/components/vote";

export default async function Page() {
  return (
    <main className="container">
      <div className="row justify-content-md-center">
        <div className="col">
          <div className="text-center">
            <h1>Voting DApp powered by Polygon</h1>
          </div>
        </div>
      </div>
      <Vote></Vote>
    </main>
  );
}
