import {
    createContext,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
    useContext,
    useState,
} from "react";
import type { DayViewMode } from "@types";

interface DayViewContextType {
    dayViewMode: DayViewMode;
    setDayViewMode: Dispatch<SetStateAction<DayViewMode>>;
}

const DayViewContext = createContext<DayViewContextType | undefined>(undefined);
    export const DayViewContextProvider = ({
        children,
    }: {
        children: ReactNode;
    }) => {
        const [dayViewMode, setDayViewMode] = useState<DayViewMode>("Calendar");

        return (
            <DayViewContext.Provider
                value={{
                    dayViewMode,
                    setDayViewMode,
                }}
            >
                {children}
            </DayViewContext.Provider>
        );
    };

export const useDayView = () => {
    const ctx = useContext(DayViewContext);
    if (!ctx) {
        throw new Error("useDayView must be used within DayViewContextProvider");
    }
    return ctx;
};
