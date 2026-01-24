import {
    createContext,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
    useContext,
    useState,
} from "react";

interface DetailContextType {
    showDetail: boolean;
    setShowDetail: (Dispatch<SetStateAction<boolean>>);
    clickedEventId?: number;
    setClickedEventId: (Dispatch<SetStateAction<number | undefined>>);
}

const DetailContext = createContext<DetailContextType | undefined>(undefined);

export const DetailContextProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [clickedEventId, setClickedEventId] = useState<number>();

    return (
        <DetailContext.Provider
            value={{
                showDetail,
                setShowDetail,
                clickedEventId,
                setClickedEventId,
            }}
        >
            {children}
        </DetailContext.Provider>
    );
};

export const useDetail = () => {
    const ctx = useContext(DetailContext);
    if (!ctx) {
        throw new Error("useDayView must be used within DayViewContextProvider");
    }
    return ctx;
};
