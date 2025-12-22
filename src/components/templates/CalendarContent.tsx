import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../store"
import ButtonAction from "../atoms/ButtonAction"
import { openCalcendarDetail } from "../../store/slices/appSlice"
import { useEffect, useState } from "react"
import CalendarContentDetail from "../organisms/CalendarContentDetail"
import EditDeleteButton from "../molecules/EditDeleteButton"

export default function CalendarContent() {
    const calendars = useSelector((state: RootState) => state.calendarState.data)
    const dispatch = useDispatch()
    const isCalendarDetailOpen = useSelector((state: RootState) => state.appState.isCalendarDetailOpen)
    const [selectedCalendarIndex, setSelectedCalendarIndex] = useState<number | null>(null)

    const handleNewCalendar = () => {
        setSelectedCalendarIndex(null)
        dispatch(openCalcendarDetail({ mode: 'new' }))
    }

    const handEditCalendar = () => {
        if (selectedCalendarIndex === null) return
        const calendar = calendars[selectedCalendarIndex]
        dispatch(openCalcendarDetail({
            mode: 'edit',
            ...calendar,
            calendarIndex: selectedCalendarIndex
        }))
    }

    const handleDeleteCalendar = () => {
        if (selectedCalendarIndex === null) return
        
        const calendar = calendars[selectedCalendarIndex]
        if (window.confirm(`Are you sure you want to delete this calendar?`)) {
            // TODO: dispatch delete action when calendar slice is ready
            // dispatch(CalendarActions.removeCalendar(selectedCalendarIndex))
            setSelectedCalendarIndex(null)
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
           <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out h-full">
                <div className="flex items-center gap-2 justify-between pb-2 border-b">
                    <EditDeleteButton 
                        onEdit={handEditCalendar}
                        onDelete={handleDeleteCalendar}
                        disabled={selectedCalendarIndex === null}
                    />
                    <ButtonAction label="new schedule" onClick={handleNewCalendar} />
            </div>
           </div>
           <CalendarContentDetail />
        </div>
    )
}