import { useDispatch, useSelector } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import type { RootState } from "../../store";
import { closeCalendarDetail } from "../../store/slices/appSlice";
import { useEffect, useState } from "react";
import type { Calendar, BooleanDays, ExceptionDate } from "../../types";
import { days } from "../../data";
import CancelSaveButton from "../molecules/CancelSaveButton";
import { CalendarActions } from "../../store/actions";
import FormInput from "../molecules/FormInput";
import ExceptionSection from "../molecules/ExceptionSection";
import { calendarsApi, calendarDatesApi } from "../../services/api";

interface CalendarFormData {
    service_id: string;
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number;
    start_date: string;
    end_date: string;
}

export default function CalendarContentDetail() {
    const dispatch = useDispatch()
    const isOpen = useSelector((state: RootState) => state.appState.isCalendarDetailOpen)
    const selectedCalendar = useSelector((state: RootState) => state.appState.selectedCalendar)
    const calendars = useSelector((state: RootState) => state.calendarState.data)
    const [exceptions, setExceptions] = useState<ExceptionDate[]>([])
    
    const methods = useForm<CalendarFormData>({
        defaultValues: {
            service_id: '',
            monday: 0,
            tuesday: 0,
            wednesday: 0,
            thursday: 0,
            friday: 0,
            saturday: 0,
            sunday: 0,
            start_date: '',
            end_date: ''
        }
    });

    const { handleSubmit, reset, watch, setValue } = methods;
    const watchedServiceId = watch("service_id");

    useEffect(() => {
        if (selectedCalendar && selectedCalendar.mode === 'edit') {
            // Convert date values to string format for date inputs
            const startDateStr = typeof selectedCalendar.startDate.value === 'string' 
                ? selectedCalendar.startDate.value 
                : '';
            const endDateStr = typeof selectedCalendar.endDate.value === 'string' 
                ? selectedCalendar.endDate.value 
                : '';
                
            reset({
                service_id: selectedCalendar.id.value,
                sunday: selectedCalendar.days[0] ? 1 : 0,
                monday: selectedCalendar.days[1] ? 1 : 0,
                tuesday: selectedCalendar.days[2] ? 1 : 0,
                wednesday: selectedCalendar.days[3] ? 1 : 0,
                thursday: selectedCalendar.days[4] ? 1 : 0,
                friday: selectedCalendar.days[5] ? 1 : 0,
                saturday: selectedCalendar.days[6] ? 1 : 0,
                start_date: startDateStr,
                end_date: endDateStr
            });
            setExceptions(selectedCalendar.exceptions || []);
        } else if (selectedCalendar && selectedCalendar.mode === 'new') {
            reset({
                service_id: '',
                monday: 0,
                tuesday: 0,
                wednesday: 0,
                thursday: 0,
                friday: 0,
                saturday: 0,
                sunday: 0,
                start_date: '',
                end_date: ''
            });
            setExceptions([]);
        }
    }, [selectedCalendar, reset]);

    const handleCancel = () => {
        // If it's a new calendar that hasn't been saved, remove the placeholder
        if (selectedCalendar?.mode === 'new') {
            dispatch(CalendarActions.removeLastCalendar());
        }
        dispatch(closeCalendarDetail());
    }

    const handleAddException = () => {
        setExceptions([...exceptions, {
            id: { value: Date.now().toString(), error: undefined },
            date: { value: null, error: undefined },
            type: { value: '', error: undefined }
        }])
    }

    const handleRemoveException = (id: string) => {
        setExceptions(exceptions.filter(ex => ex.id.value !== id))
    }

    const handleExceptionDateChange = (id: string, date: string) => {
        setExceptions(exceptions.map(ex => 
            ex.id.value === id ? { ...ex, date: { value: date, error: undefined } } : ex
        ))
    }

    const handleExceptionTypeChange = (id: string, type: string) => {
        setExceptions(exceptions.map(ex => 
            ex.id.value === id ? { ...ex, type: { value: type, error: undefined } } : ex
        ))
    }

    const onSubmit = async (data: CalendarFormData) => {
        try {
            // Format dates from YYYY-MM-DD to YYYYMMDD for GTFS
            const formatDate = (dateStr: string) => dateStr.replace(/-/g, '');

            // Prepare calendar API data
            const calendarApiData = {
                service_id: data.service_id,
                monday: data.monday,
                tuesday: data.tuesday,
                wednesday: data.wednesday,
                thursday: data.thursday,
                friday: data.friday,
                saturday: data.saturday,
                sunday: data.sunday,
                start_date: formatDate(data.start_date),
                end_date: formatDate(data.end_date)
            };

            // Save to database
            if (selectedCalendar?.mode === 'edit') {
                // Use original service_id for API update (in case user changed it)
                const originalServiceId = selectedCalendar.id.value;
                await calendarsApi.update(originalServiceId, calendarApiData);
                
                // Delete all existing exception dates for this service and recreate
                try {
                    await calendarDatesApi.deleteByServiceId(originalServiceId);
                } catch (e) {
                    // Ignore error if no exception dates exist
                    console.log('No existing exception dates to delete');
                }
            } else {
                // Create new calendar
                await calendarsApi.create(calendarApiData);
            }

            // Save exception dates to calendar_dates table
            for (const exception of exceptions) {
                if (exception.date.value && exception.type.value) {
                    const exceptionDate = typeof exception.date.value === 'string' 
                        ? formatDate(exception.date.value) 
                        : '';
                    
                    if (exceptionDate) {
                        await calendarDatesApi.create({
                            service_id: data.service_id,
                            date: exceptionDate,
                            exception_type: parseInt(exception.type.value, 10)
                        });
                    }
                }
            }

            // Convert form data to Calendar type for Redux
            const daysArray: BooleanDays = [
                data.sunday === 1,
                data.monday === 1,
                data.tuesday === 1,
                data.wednesday === 1,
                data.thursday === 1,
                data.friday === 1,
                data.saturday === 1
            ];

            const calendar: Calendar = {
                id: { value: data.service_id, error: undefined },
                startDate: { value: data.start_date, error: undefined },
                endDate: { value: data.end_date, error: undefined },
                days: daysArray,
                exception: exceptions.length,
                exceptions: exceptions
            };

            if (selectedCalendar?.mode === 'edit' && selectedCalendar.calendarIndex !== undefined) {
                dispatch(CalendarActions.updateCalendar({ index: selectedCalendar.calendarIndex, calendar }));
            } else {
                // In new mode, update the placeholder calendar that was added
                const lastIndex = calendars.length - 1;
                if (lastIndex >= 0) {
                    dispatch(CalendarActions.updateCalendar({ index: lastIndex, calendar }));
                }
            }
            
            dispatch(closeCalendarDetail());
        } catch (error) {
            console.error('Failed to save calendar:', error);
        }
    }

    return (
        <aside
            className={`fixed right-0 top-0 h-screen w-[350px] bg-white shadow-xl z-50 border-l overflow-hidden transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-semibold">
                        {selectedCalendar?.mode === 'new' 
                            ? (watchedServiceId || 'new calendar') 
                            : `${watchedServiceId} (edit)`
                        }
                    </h3>
                    <button 
                        onClick={handleCancel} 
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                        type="button"
                    >
                        ✕
                    </button>
                </div>

                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {/* Service ID */}
                            <FormInput
                                name="service_id"
                                label="service id"
                                placeholder="service id"
                            />

                            {/* Service Operates */}
                            <div>
                                <label className="block text-sm font-medium mb-2">service operates</label>
                                <div className="grid grid-cols-7 gap-1">
                                    {days.map(({ index, key, label }) => {
                                        const dayFieldName = key === 'sun' ? 'sunday' : 
                                                           key === 'mon' ? 'monday' : 
                                                           key === 'tues' ? 'tuesday' : 
                                                           key === 'wed' ? 'wednesday' : 
                                                           key === 'thurs' ? 'thursday' : 
                                                           key === 'fri' ? 'friday' : 
                                                           'saturday';
                                        const isActive = watch(dayFieldName as keyof CalendarFormData) === 1;
                                        
                                        return (
                                            <div key={index} className="flex flex-col items-center">
                                                <span className="text-xs mb-1">{label}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setValue(dayFieldName as keyof CalendarFormData, isActive ? 0 : 1)}
                                                    className={`w-full h-12 border rounded transition-colors ${
                                                        isActive
                                                            ? 'bg-blue-500 border-blue-500'
                                                            : 'bg-white border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Start and End Date */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">start date</label>
                                    <input
                                        type="date"
                                        {...methods.register('start_date')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">end date</label>
                                    <input
                                        type="date"
                                        {...methods.register('end_date')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Exception Section */}
                            <ExceptionSection
                                exceptions={exceptions}
                                onAddException={handleAddException}
                                onRemoveException={handleRemoveException}
                                onDateChange={handleExceptionDateChange}
                                onTypeChange={handleExceptionTypeChange}
                            />
                        </div>

                        <CancelSaveButton 
                            onCancel={handleCancel} 
                            onSave={handleSubmit(onSubmit)}
                            disabled={false}
                        />
                    </form>
                </FormProvider>
            </div>
        </aside>
    )
}