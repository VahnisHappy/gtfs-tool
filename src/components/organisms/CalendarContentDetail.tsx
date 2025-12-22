import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { closeCalendarDetail } from "../../store/slices/appSlice";
import { useState } from "react";
import TextInput from "../atoms/TextInput";
import ButtonAction from "../atoms/ButtonAction";

type Exception = {
    id: string;
    date: string;
    type: string;
}

export default function CalendarContentDetail() {
    const dispatch = useDispatch()
    const isOpen = useSelector((state: RootState) => state.appState.isCalendarDetailOpen)
    
    const [serviceId, setServiceId] = useState('')
    const [operatingDays, setOperatingDays] = useState({
        sun: false,
        mon: false,
        tues: false,
        wed: false,
        thurs: false,
        fri: false,
        sat: false
    })
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [exceptions, setExceptions] = useState<Exception[]>([])

    const handleClose = () => {
        dispatch(closeCalendarDetail())
    }

    const handleDayToggle = (day: keyof typeof operatingDays) => {
        setOperatingDays(prev => ({
            ...prev,
            [day]: !prev[day]
        }))
    }

    const handleAddException = () => {
        setExceptions([...exceptions, {
            id: Date.now().toString(),
            date: '',
            type: ''
        }])
    }

    const handleRemoveException = (id: string) => {
        setExceptions(exceptions.filter(ex => ex.id !== id))
    }

    const handleExceptionDateChange = (id: string, date: string) => {
        setExceptions(exceptions.map(ex => 
            ex.id === id ? { ...ex, date } : ex
        ))
    }

    const handleExceptionTypeChange = (id: string, type: string) => {
        setExceptions(exceptions.map(ex => 
            ex.id === id ? { ...ex, type } : ex
        ))
    }

    const handleSave = () => {
        // TODO: Implement save logic
        console.log({ serviceId, operatingDays, startDate, endDate, exceptions })
    }

    const handleCancel = () => {
        dispatch(closeCalendarDetail())
    }

    const days = [
        { key: 'sun', label: 'sun' },
        { key: 'mon', label: 'mon' },
        { key: 'tues', label: 'tues' },
        { key: 'wed', label: 'wed' },
        { key: 'thurs', label: 'thurs' },
        { key: 'fri', label: 'fri' },
        { key: 'sat', label: 'sat' }
    ]

    return (
        <aside
            className={`fixed right-0 top-0 h-screen w-[350px] bg-white shadow-xl z-50 border-l overflow-hidden transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-semibold">
                        calendar
                    </h3>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Service ID */}
                    <TextInput
                        label="service id"
                        value={serviceId}
                        onChange={setServiceId}
                        placeholder="input"
                    />

                    {/* Service Operates */}
                    <div>
                        <label className="block text-sm font-medium mb-2">service operates</label>
                        <div className="grid grid-cols-7 gap-1">
                            {days.map(({ key, label }) => (
                                <div key={key} className="flex flex-col items-center">
                                    <span className="text-xs mb-1">{label}</span>
                                    <button
                                        onClick={() => handleDayToggle(key as keyof typeof operatingDays)}
                                        className={`w-full h-12 border rounded transition-colors ${
                                            operatingDays[key as keyof typeof operatingDays]
                                                ? 'bg-blue-500 border-blue-500'
                                                : 'bg-white border-gray-300 hover:bg-gray-50'
                                        }`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Start and End Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">start date</label>
                            <select
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">select</option>
                                {/* Add date options here */}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">end date</label>
                            <select
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">select</option>
                                {/* Add date options here */}
                            </select>
                        </div>
                    </div>

                    {/* Exception Section */}
                    <div className="border-t pt-4">
                        <h4 className="text-lg font-semibold mb-4">exception</h4>
                        
                        <button
                            onClick={handleAddException}
                            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors mb-4"
                        >
                            add exception date
                        </button>

                        <div className="space-y-3">
                            {exceptions.map((exception) => (
                                <div key={exception.id} className="flex items-center gap-2">
                                    <select
                                        value={exception.date}
                                        onChange={(e) => handleExceptionDateChange(exception.id, e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">select date</option>
                                        {/* Add date options here */}
                                    </select>
                                    <select
                                        value={exception.type}
                                        onChange={(e) => handleExceptionTypeChange(exception.id, e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">exception type</option>
                                        <option value="added">Service Added</option>
                                        <option value="removed">Service Removed</option>
                                    </select>
                                    <button
                                        onClick={() => handleRemoveException(exception.id)}
                                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                                            <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"/>
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={handleCancel}
                        className="px-6 py-2 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors"
                    >
                        cancel
                    </button>
                    <ButtonAction 
                        label="save"
                        onClick={handleSave}
                    />
                </div>
            </div>
        </aside>
    )
}