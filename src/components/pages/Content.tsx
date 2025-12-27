import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import type { Content as ContentType} from "../../types";
import StopContent from "../templates/StopContent";
import RouteContent from "../templates/RouteContent";
import CalendarContent from "../templates/CalendarContent";
import TripContent from "../templates/TripContent";

export default function Content () {
    const renderSidebarContent = (panel: ContentType) => {
        switch(panel) {
            case 'stops': return <StopContent />
            case 'routes': return <RouteContent />
            case 'calendar': return <CalendarContent />
            case 'trips': return <TripContent />
        }
    }
    const {content} = useSelector((state: RootState) => state.appState)
    return (
        <div className="relative flex h-screen w-full max-w-[240px] flex-col bg-[#F5F7F9] bg-clip-border p-2 text-gray-700 shadow-xl shadow-blue-gray-900/5">
            {renderSidebarContent(content)}
        </div>
    )

}