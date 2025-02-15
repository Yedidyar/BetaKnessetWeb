import React from "react";
import FullCalendar from "@fullcalendar/react";
import heLocale from "@fullcalendar/core/locales/he";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import Typography from "@material-ui/core/Typography";

import { ScrollPage } from "../../components/ScrollableView";
import "./index.css";
import config from "../../config.json";
import { useBigScreen } from "../../utils";

interface CalendarEvent {
    sessionType: number;
    sessionID: number;
    filePath: string;
    name: string;
    startDate: string;
    finishDate: string;
    broadcastUrl: null;
}

const CalendarComponent = React.memo(function ({
    loading,
    ...props
}: Pick<
    FullCalendar["props"],
    | "plugins"
    | "headerToolbar"
    | "footerToolbar"
    | "events"
    | "datesSet"
    | "eventClick"
> & {
    loading: number;
}) {
    return (
        <div className="calendar demo-app">
            <div className="demo-app-main" style={{ position: "relative" }}>
                <FullCalendar
                    initialView="listWeek"
                    locale={heLocale}
                    editable={false}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={true}
                    eventContent={Event} // custom render function
                    {...props}
                />
            </div>
            <Typography
                style={{
                    position: "fixed",
                    textAlign: "center",
                    fontSize: "20pt",
                    width: "100%",
                    backgroundColor: "#0d47a1",
                    color: "white",
                    padding: ".3em 0",
                    opacity: loading > 0 ? 1 : 0,
                    zIndex: 10,
                    bottom: 0,
                    transition: "opacity .4s ease-in-out",
                    pointerEvents: "none",
                }}
            >
                טוען...
            </Typography>
        </div>
    );
});

class CalendarView extends React.PureComponent<
    unknown,
    { currentEvents: Record<number, CalendarEvent>; loading: number }
> {
    state = {
        currentEvents: {},
        loading: 0,
    };

    render() {
        return (
            <CalendarComponent
                plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin,
                    listPlugin,
                ]}
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "listWeek,dayGridMonth,timeGridWeek,timeGridDay",
                }}
                events={Object.values(this.state.currentEvents)}
                datesSet={this.handleDates.bind(this)}
                eventClick={this.handleEventClick}
                loading={this.state.loading}
            />
        );
    }

    handleEventClick = (
        selectInfo: Parameters<
            NonNullable<FullCalendar["props"]["eventClick"]>
        >[0]
    ) => {
        console.debug(selectInfo);
    };

    handleEvents = (events: Record<number, CalendarEvent>) => {
        this.setState({
            currentEvents: events,
        });
    };
    handleDates(
        fetchInfo: Parameters<NonNullable<FullCalendar["props"]["datesSet"]>>[0]
    ) {
        this.setState((s) => ({ loading: s.loading + 1 }));
        // TODO copy from https://fullcalendar.io/docs/events-function
        fetch(
            `${
                config.server
            }/KnessetSchedule?StartDate=${fetchInfo.start.toISOString()}&FinishDate=${fetchInfo.end.toISOString()}`,
            fetchInfo as RequestInit
        )
            .then((res) => res.json())
            .then((data) => {
                const events: Record<number, CalendarEvent> = {};
                for (const r of data) {
                    events[r.result.sessionID] = {
                        id: r.result.sessionID,
                        title: r.result.name,
                        start: r.result.startDate,
                        end: r.result.finishDate,
                        items: r.items,
                        color: r.result.sessionType === 1 ? "purple" : null, // Should be done in render clause
                        ...r.result,
                    };
                }
                this.setState((s) => ({
                    currentEvents: Object.assign(s.currentEvents, events),
                }));
            })
            .finally(() => this.setState((s) => ({ loading: s.loading - 1 })));
    }
}

function Event(eventInfo: any) {
    const { event } = eventInfo;
    const { extendedProps } = event;

    switch (extendedProps.sessionType) {
        case 1:
            return <CommitteeEvent event={event} {...extendedProps} />;
        case 2:
            return <PlenumEvent event={event} {...extendedProps} />;
        default:
            return <></>;
    }
}

function CommitteeEvent({
    event,
    items,
    filePath,
}: {
    event: { title: string };
    items: any[];
    filePath: string;
}) {
    return (
        <div
            onClick={() =>
                window.open(
                    `https://docs.google.com/gview?url=${filePath}`,
                    "_blank"
                )
            }
        >
            {/*<b>{eventInfo.timeText}</b>*/}
            {/* TODO - <i>{eventInfo.event.title}</i> (need to parse it nicely, maybe in server)*/}
            <b>{event.title}</b>
            <div style={{ whiteSpace: "normal" }}>
                <i>
                    {truncateName(
                        items
                            .slice(0, 5)
                            .map((i) => i.itemName)
                            .join(", "),
                        100
                    )}{" "}
                    -{" "}
                    {items.length === 1 ? "נושא אחד" : `${items.length} נושאים`}
                </i>
            </div>
        </div>
    );
}

function PlenumEvent({ items, filePath }: { items: any[]; filePath: string }) {
    return (
        <div
            onClick={() =>
                window.open(
                    `https://docs.google.com/viewer?url=${filePath}`,
                    "_blank"
                )
            }
        >
            {/*<b>{eventInfo.timeText}</b>*/}
            {/* TODO - <i>{eventInfo.event.title}</i> (need to parse it nicely, maybe in server)*/}
            <b>ישיבת מליאה</b>
            <div style={{ whiteSpace: "normal" }}>
                <i>
                    {truncateName(
                        items
                            .slice(0, 5)
                            .map((i) => i.itemName)
                            .join(", "),
                        100
                    )}{" "}
                    -{" "}
                    {items.length === 1 ? "נושא אחד" : `${items.length} נושאים`}
                </i>
            </div>
        </div>
    );
}

class MobileCalendarView extends CalendarView {
    render() {
        return (
            <CalendarComponent
                plugins={[timeGridPlugin, listPlugin]}
                headerToolbar={{
                    left: "",
                    center: "title",
                    right: "listWeek,timeGridDay",
                }}
                footerToolbar={{
                    left: "prev,next",
                    center: "",
                    right: "today",
                }}
                events={Object.values(this.state.currentEvents)}
                datesSet={this.handleDates.bind(this)}
                eventClick={this.handleEventClick}
                loading={this.state.loading}
            />
        );
    }
}

function truncateName(n: string, l: number) {
    if (n.length < l) return n;
    return n.substring(0, l) + "...";
}

export default React.memo(function Calendar() {
    const isBigScreen = useBigScreen();
    return (
        <ScrollPage id="calendar" limit>
            <div style={{ position: "relative", width: "100%" }}>
                <Typography
                    variant="h4"
                    component="h2"
                    style={{ textAlign: "center", margin: ".3em 0" }}
                >
                    לו״ז הכנסת
                </Typography>
                <Typography style={{ textAlign: "center", margin: ".3em 0" }}>
                    <a href="https://calendar.google.com/calendar/u/1?cid=YmV0YWtuZXNzZXRAZ21haWwuY29t">
                        לחצו כאן להוספת הלו״ז ל Google Calendar שלכם
                    </a>
                </Typography>
                {isBigScreen ? <CalendarView /> : <MobileCalendarView />}
            </div>
        </ScrollPage>
    );
});
