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
      <div className="modal-box max-w-2xl rounded-[30px] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(244,247,241,0.9))] p-8 shadow-[0_30px_80px_rgba(16,24,40,0.18)]">
        <div className="mb-8">
          <p className="mini-label mb-2">new room</p>
          <h3 className="text-3xl font-bold text-slate-950">Create a Session</h3>
          <p className="mt-2 text-sm subtle-text">Pick a problem and launch a two-person collaborative room.</p>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Select a problem <span className="text-rose-600">*</span>
            </label>

            <select
              className="select w-full rounded-2xl border-slate-200 bg-white font-medium shadow-sm"
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

          {roomConfig.problem && (
            <div className="surface-panel grid-pattern flex items-start gap-4 rounded-[24px] p-5">
              <div className="icon-chip">
                <Code2Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="mb-2 text-base font-bold text-slate-950">Room Summary</p>
                <div className="space-y-1 text-sm subtle-text">
                  <p>
                    Problem: <span className="font-semibold text-slate-950">{roomConfig.problem}</span>
                  </p>
                  <p>
                    Max Participants: <span className="font-semibold text-slate-950">2 (1-on-1 session)</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-action mt-10 gap-3">
          <button className="action-button-secondary" onClick={onClose}>
            Cancel
          </button>

          <button
            className="action-button disabled:cursor-not-allowed disabled:opacity-60"
            onClick={onCreateRoom}
            disabled={isCreating || !roomConfig.problem}
          >
            {isCreating ? (
              <>
                <LoaderIcon className="h-5 w-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <PlusIcon className="h-5 w-5" />
                Create
              </>
            )}
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-slate-950/45" onClick={onClose}></div>
    </div>
  );
}
export default CreateSessionModal;
