import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import type { Sidebar as SidebarType} from "../../types";
import StopContent from "../templates/StopContent";

export default function Sidebar () {
    const renderSidebarContent = (panel: SidebarType) => {
        switch(panel) {
            case 'stops': return <StopContent />
        }
    }
    const { sidebarContent } = useSelector((state: RootState) => state.appState);
    return (
        <div>
            {renderSidebarContent(sidebarContent)}
        </div>
    )

}