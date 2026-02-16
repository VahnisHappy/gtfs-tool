import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { calendarsApi, calendarDatesApi } from './api';
import { CalendarActions } from '../store/actions';
import type { Calendar, BooleanDays, ExceptionDate } from '../types';

interface BackendCalendar {
  service_id: string;
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
  start_date: string; // Format: YYYYMMDD
  end_date: string; // Format: YYYYMMDD
}

interface BackendCalendarDate {
  service_id: string;
  date: string; // Format: YYYYMMDD
  exception_type: number;
}

/**
 * Convert YYYYMMDD to YYYY-MM-DD for form inputs
 */
function formatDateForInput(dateStr: string): string {
  if (!dateStr || dateStr.length !== 8) return '';
  return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
}

/**
 * Hook to load calendars and calendar_dates from the backend on app initialization
 */
export function useLoadCalendars() {
  const dispatch = useDispatch();
  const hasLoadedCalendars = useRef(false);

  useEffect(() => {
    // Only load calendars once
    if (hasLoadedCalendars.current) return;

    const loadCalendars = async () => {
      try {
        console.log('Loading calendars from backend...');
        const backendCalendars = await calendarsApi.getAll() as BackendCalendar[];
        const backendCalendarDates = await calendarDatesApi.getAll() as BackendCalendarDate[];
        
        // Group calendar dates by service_id
        const calendarDatesMap = new Map<string, BackendCalendarDate[]>();
        for (const cd of backendCalendarDates) {
          const existing = calendarDatesMap.get(cd.service_id) || [];
          existing.push(cd);
          calendarDatesMap.set(cd.service_id, existing);
        }

        // Convert backend calendar format to frontend Calendar type
        const calendars: Calendar[] = backendCalendars.map((backendCalendar) => {
          // Convert days to BooleanDays array [sun, mon, tue, wed, thu, fri, sat]
          const daysArray: BooleanDays = [
            backendCalendar.sunday === 1,
            backendCalendar.monday === 1,
            backendCalendar.tuesday === 1,
            backendCalendar.wednesday === 1,
            backendCalendar.thursday === 1,
            backendCalendar.friday === 1,
            backendCalendar.saturday === 1,
          ];

          // Get exceptions for this calendar
          const backendExceptions = calendarDatesMap.get(backendCalendar.service_id) || [];
          const exceptions: ExceptionDate[] = backendExceptions.map((ex, idx) => ({
            id: { value: `${backendCalendar.service_id}-${ex.date}-${idx}`, error: undefined },
            date: { value: formatDateForInput(ex.date) as any, error: undefined },
            type: { value: ex.exception_type.toString(), error: undefined },
          }));

          return {
            id: { value: backendCalendar.service_id, error: undefined },
            startDate: { value: formatDateForInput(backendCalendar.start_date) as any, error: undefined },
            endDate: { value: formatDateForInput(backendCalendar.end_date) as any, error: undefined },
            days: daysArray,
            exception: exceptions.length,
            exceptions,
          };
        });

        console.log(`Loaded ${calendars.length} calendars from backend`);
        hasLoadedCalendars.current = true;
        
        // Load all calendars into Redux store
        dispatch(CalendarActions.setCalendar(calendars));
        
      } catch (error) {
        console.error('Failed to load calendars from backend:', error);
        // Don't throw - allow app to work with empty state
      }
    };

    loadCalendars();
  }, [dispatch]);
}
