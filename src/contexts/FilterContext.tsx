import {
	createContext,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	useContext,
	useState,
} from "react";
import type { Category } from "../util/types";

interface FilterContextType {
	globalStatus: Category | null;
	globalOrg: Category | null;
	globalCategory: Category | null;

	setGlobalStatus: Dispatch<SetStateAction<Category | null>>;
	setGlobalOrg: Dispatch<SetStateAction<Category | null>>;
	setGlobalCategory: Dispatch<SetStateAction<Category | null>>;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterContextProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [globalStatus, setGlobalStatus] = useState<Category | null>(null);
	const [globalOrg, setGlobalOrg] = useState<Category | null>(null);
	const [globalCategory, setGlobalCategory] = useState<Category | null>(null);

	return (
		<FilterContext.Provider
			value={{
				globalStatus,
				globalOrg,
				globalCategory,
				setGlobalStatus,
				setGlobalOrg,
				setGlobalCategory,
			}}
		>
			{children}
		</FilterContext.Provider>
	);
};

export const useFilter = () => {
	const ctx = useContext(FilterContext);
	if (!ctx) {
		throw new Error("useFilter must be used within FilterProvider");
	}
	return ctx;
};
