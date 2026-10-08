"use client";

import { addDays } from "date-fns";
import { useDayMeetings } from "../../api/useDayMeetings";
import { useSelectedDay } from "../../hooks/useSelectedDay";
import { DateHeader } from "./DateHeader";
import { DayListArea } from "./DayListArea";
import { ToolsRow } from "./ToolsRow";
import { WidgetSkeleton } from "./WidgetSkeleton";
import styles from "./CalendarWidget.module.css";

/**
 * Home calendar widget = the assignment's "Upcoming meetings" (PRD §7.1.6–7.1.8): one day at a time,
 * Today / previous / next / day picker, Zoom's event cards. First load shows the widget skeleton.
 */
export function CalendarWidget({ today }: { today: Date | null }) {
  const { day, setDay } = useSelectedDay(today);
  const query = useDayMeetings(day);

  if (!day || !today || query.isPending) {
    return (
      <section className={styles.widget} aria-label="Upcoming meetings">
        <WidgetSkeleton />
      </section>
    );
  }

  return (
    <section className={styles.widget} aria-label="Upcoming meetings">
      <DateHeader day={day} today={today} onSelectDay={setDay} />
      <ToolsRow onToday={() => setDay(today)} onShift={(days) => setDay(addDays(day, days))} onRefresh={() => void query.refetch()} />
      <DayListArea
        day={day}
        items={query.isError ? undefined : query.data}
        isFetching={query.isFetching}
        onRetry={() => void query.refetch()}
        onSelectDay={setDay}
      />
    </section>
  );
}
