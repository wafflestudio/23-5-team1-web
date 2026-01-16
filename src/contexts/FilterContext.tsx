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
	globalStatus: Category[];
	globalOrg: Category[];
	globalCategory: Category[];

	setGlobalStatus: Dispatch<SetStateAction<Category[]>>;
	setGlobalOrg: Dispatch<SetStateAction<Category[]>>;
	setGlobalCategory: Dispatch<SetStateAction<Category[]>>;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterContextProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [globalStatus, setGlobalStatus] = useState<Category[]>([]);
	const [globalOrg, setGlobalOrg] = useState<Category[]>([]);
	const [globalCategory, setGlobalCategory] = useState<Category[]>([]);

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
