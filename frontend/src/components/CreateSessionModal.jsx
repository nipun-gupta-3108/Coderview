import { Code2Icon, LoaderIcon, PlusIcon } from "lucide-react";
import { PROBLEMS } from "../data/problems";

function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  const problems = Object.values(PROBLEMS);

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl bg-gradient-to-br from-base-100 to-base-200 border border-base-300/50 shadow-2xl">
        <h3 className="font-black text-3xl mb-8 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Create New Session
        </h3>

        <div className="space-y-8">
          {/* PROBLEM SELECTION */}
          <div className="space-y-3">
            <label className="label">
              <span className="label-text font-bold text-base">Select a Problem</span>
              <span className="label-text-alt text-error font-bold">*</span>
            </label>

            <select
              className="select w-full font-medium border-base-300/60 bg-base-100 hover:border-primary/40 focus:border-primary"
              value={roomConfig.problem}
              onChange={(e) => {
                const selectedProblem = problems.find((p) => p.title === e.target.value);
                setRoomConfig({
                  difficulty: selectedProblem.difficulty,
                  problem: e.target.value,
                });
              }}
            >
              <option value="" disabled>
                Choose a coding problem...
              </option>

              {problems.map((problem) => (
                <option key={problem.id} value={problem.title}>
                  {problem.title} ({problem.difficulty})
                </option>
              ))}
            </select>
          </div>

          {/* ROOM SUMMARY */}
          {roomConfig.problem && (
            <div className="alert alert-success bg-gradient-to-r from-success/20 to-success/10 border border-success/40">
              <Code2Icon className="w-6 h-6 text-success" />
              <div>
                <p className="font-bold text-base mb-2">Room Summary</p>
                <div className="space-y-1 text-sm font-medium">
                  <p>
                    Problem: <span className="font-bold text-success">{roomConfig.problem}</span>
                  </p>
                  <p>
                    Max Participants: <span className="font-bold text-success">2 (1-on-1 session)</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-action gap-3 mt-10">
          <button className="btn btn-outline btn-lg font-bold" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn btn-lg bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg hover:shadow-xl border-none disabled:opacity-50"
            onClick={onCreateRoom}
            disabled={isCreating || !roomConfig.problem}
          >
            {isCreating ? (
              <>
                <LoaderIcon className="w-5 h-5 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <PlusIcon className="w-5 h-5" />
                <span>Create</span>
              </>
            )}
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-black/50" onClick={onClose}></div>
    </div>
  );
}
export default CreateSessionModal;