import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";



export default function TripContentDetail() {
    const isOpen = useSelector((state: RootState) => state.appState.isTripDetailOpen);
    const dispatch = useDispatch();

    const routes = useSelector((state: RootState) => state.routeState.data);
    const calendars = useSelector((state: RootState) => state.calendarState.data);
    const routes_map = new Map(routes.map((route, index) => [index, route.id.value || "<no id>"]));
    const calendars_map = new Map(calendars.map((calendar, index) => [index, calendar.id.value || "<no id>"]));


    return (
       <aside
            className={`fixed right-0 top-0 h-screen w-[350px] bg-white shadow-xl z-50 border-l overflow-hidden transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
        </aside>
    )
}
