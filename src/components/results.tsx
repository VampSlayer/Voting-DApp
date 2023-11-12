export interface Candidate {
  id: number;
  name: string;
  votes: number;
}

export const Results = ({ candidates }: { candidates: Candidate[] }) => {
  return (
    <div className="row justify-content-md-center">
      <div className="col">
        <div className="text-center">
          <table className="table">
            <thead>
              <tr>
                <td className="fw-bold">Option</td>
                <td className="fw-bold">Votes</td>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td>{candidate.name}</td>
                  <td>{candidate.votes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
