import { useSelector } from "react-redux";
import type { RootState } from "../../store";

export default function StopContent() {
    const stops = useSelector((state: RootState) => state.stopState.data);
    return (
        <div className="flex items-center justify-between p-4">
                <h2 className="text-lg text-gray-900">Stops</h2>
                <button
                    type="button"
                    onClick={() => {
                        // TODO: connect to create stop mode event on click
                        console.log('Create new stop');
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#00A8E8] hover:bg-[#009AD6] active:bg-[#009AD6] text-white text-sm font-medium rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#009AD6]"
                    aria-label="Create new stop"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    <span>New Stop</span>
                </button>
            </div>
    )
}