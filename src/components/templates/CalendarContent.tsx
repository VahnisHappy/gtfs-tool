import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../store"
import ButtonAction from "../atoms/ButtonAction"
import { openCalendarDetail } from "../../store/slices/appSlice"
import { useEffect, useRef, useState } from "react"
import CalendarContentDetail from "../organisms/CalendarContentDetail"
import EditDeleteButton from "../molecules/EditDeleteButton"
import CalendarCard from "../molecules/CalendarCard"
import { CalendarActions } from "../../store/actions"
import { calendarsApi, calendarDatesApi } from "../../services/api"

export default function CalendarContent() {
    const calendars = useSelector((state: RootState) => state.calendarState.data)
    const dispatch = useDispatch()
    const isCalendarDetailOpen = useSelector((state: RootState) => state.appState.isCalendarDetailOpen)
    const [selectedCalendarIndex, setSelectedCalendarIndex] = useState<number | null>(null)
    const calendarListRef = useRef<HTMLDivElement>(null)

    const handleNewCalendar = () => {
        // Add placeholder calendar to Redux
        const newCalendar = {
            id: { value: '', error: undefined },
            startDate: { value: null, error: undefined },
            endDate: { value: null, error: undefined },
            days: [false, false, false, false, false, false, false] as [boolean, boolean, boolean, boolean, boolean, boolean, boolean],
            exception: 0,
            exceptions: []
        };
        dispatch(CalendarActions.addCalendar(newCalendar));
        setSelectedCalendarIndex(calendars.length); // Select the new calendar
        dispatch(openCalendarDetail({ mode: 'new' }))
    }

    const handEditCalendar = () => {
        if (selectedCalendarIndex === null) return
        const calendar = calendars[selectedCalendarIndex]
        dispatch(openCalendarDetail({
            mode: 'edit',
            ...calendar,
            calendarIndex: selectedCalendarIndex
        }))
    }

    const handleDeleteCalendar = async () => {
        if (selectedCalendarIndex === null) return
        
        const calendar = calendars[selectedCalendarIndex]
        if (window.confirm(`Are you sure you want to delete calendar "${calendar.id.value}"?`)) {
            try {
                // Delete from database
                await calendarsApi.delete(calendar.id.value);
                // Also delete any associated exception dates
                try {
                    await calendarDatesApi.deleteByServiceId(calendar.id.value);
                } catch (e) {
                    // Ignore if no exception dates exist
                }
                // Remove from Redux state
                dispatch(CalendarActions.removeCalendar(selectedCalendarIndex));
                setSelectedCalendarIndex(null);
            } catch (error) {
                console.error('Failed to delete calendar:', error);
                alert('Failed to delete calendar from database');
            }
        }
    }

    useEffect (() => {
        const timer = setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 300);
        return () => clearTimeout(timer);
    }, [isCalendarDetailOpen])

    return (
        <div className="flex h-full w-full">
            <div 
                className="flex-1 flex flex-col transition-all duration-300 ease-in-out h-full"
                ref={calendarListRef}
            >
            <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out h-full">
                    <div className="flex items-center gap-2 justify-between pb-2 border-b">
                        <EditDeleteButton 
                            onEdit={handEditCalendar}
                            onDelete={handleDeleteCalendar}
                            disabled={selectedCalendarIndex === null}
                        />
                        <ButtonAction label="new schedule" onClick={handleNewCalendar} />
                    </div>
                <div className="flex-1 overflow-y-auto">
                    <div className="py-2">
                        <h3 className="font-semibold mb-2">calendar list ({calendars.length})</h3>
                        {calendars.length === 0 ? (
                            <p className="text-gray-500 text-sm px-4">No calendars yet. Click "new schedule" to create one.</p>
                        ) : (
                            <ul className="space-y-0">
                                {calendars.map((calendar, index) => (
                                    <CalendarCard
                                        key={index}
                                        calendar={calendar}
                                        isSelected={selectedCalendarIndex === index}
                                        onSelect={() => setSelectedCalendarIndex(index)}
                                    />
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
           <CalendarContentDetail />
        </div>
    )
}