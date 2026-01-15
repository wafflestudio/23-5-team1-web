import { useState } from "react";
import { FaAnglesLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import { useEvents } from "../contexts/EventContext";
import { useFilter } from "../contexts/FilterContext";
import styles from "../styles/Sidebar.module.css";
import type { Category } from "../util/types";

export const Sidebar = () => {
	type FilterType = "status" | "org" | "category";
	interface Filter {
		name: FilterType;
		label: string;
		list: Category[];
		state: Category | null;
		setter: React.Dispatch<React.SetStateAction<Category | null>>;
		globalSetter: React.Dispatch<React.SetStateAction<Category | null>>;
	}

	const { user } = useAuth();
	const { categoryGroups, isLoadingMeta } = useEvents();
	const {
		globalCategory,
		globalOrg,
		globalStatus,
		setGlobalCategory,
		setGlobalOrg,
		setGlobalStatus,
	} = useFilter();

	// state : filter 값들 저장 - context에서 값 가져오기
	const [status, setStatus] = useState<Category | null>(globalStatus);
	const [org, setOrg] = useState<Category | null>(globalOrg);
	const [category, setCategory] = useState<Category | null>(globalCategory);

	// 제외 키워드
	const [excludeTags, _setExcludeTags] = useState<string[]>([]);

	// 모집중, 등
	const STATUS_LIST = categoryGroups[0].categories;
	// 행사 카테고리
	const CATEGORY_LIST = categoryGroups[2].categories;
	// 주체 기관
	const ORG_LIST = categoryGroups[1].categories;
	const filterDict: Filter[] = [
		{
			name: "category",
			label: "행사 종류",
			list: CATEGORY_LIST,
			state: category,
			setter: setCategory,
			globalSetter: setGlobalCategory,
		},
		{
			name: "org",
			label: "주체 기관",
			list: ORG_LIST,
			state: org,
			setter: setOrg,
			globalSetter: setGlobalOrg,
		},
		{
			name: "status",
			label: "모집 현황",
			list: STATUS_LIST,
			state: status,
			setter: setStatus,
			globalSetter: setGlobalStatus,
		},
	];

	// 클릭하자마자 로직 적용 & - 바로 context로 write
	const handleChange = (value: string, list: Category[], type: FilterType) => {
		const obj = filterDict.find((obj) => obj.name === type);
		if (!obj) return;

		if (value === "total") {
			obj.setter(null);
			obj.globalSetter(null);
		} else {
			const category = list.find((el) => el.name === value);
			obj.setter(category || null);
			obj.globalSetter(category || null);
		}
	};

	const navigate = useNavigate();

	const handleHeaderClick = () => {
		// if user exists: refresh page
		if (user) {
			navigate("/main");
		} else {
			// else : go to login page
			navigate("/auth/login");
		}
	};

	return (
		<div className={styles.sidebarContainer}>
			<div className={styles.headerRow}>
				<button
					type="button"
					onClick={handleHeaderClick}
					className={styles.header}
				>
					{user ? `${user?.username}의 캘린더` : "로그인하고 이용하기"}
				</button>
				<button className={styles.collapseBtn} type="button">
					<FaAnglesLeft width={20} color="rgba(171,171,171,1)" />
				</button>
			</div>

			<div className={styles.sectionTitle}>필터</div>

			{isLoadingMeta ? (
				<span className={styles.filterTitle}>필터 로딩중 ...</span>
			) : (
				filterDict.map(({ name, label, list, state }) => (
					<div key={name} className={styles.filterGroup}>
						<div className={styles.labelRow}>
							<img
								alt={`${name} icon`}
								className={styles.icon}
								src={`../assets/${name}.svg`}
							/>
							<span className={styles.labelText}>{label}</span>
						</div>

						<div className={styles.selectWrapper}>
							<select
								id={name}
								className={styles.dropdown}
								value={state?.name || "total"}
								onChange={(e) => handleChange(e.target.value, list, name)}
							>
								<option value="total">전체</option>
								{list.map((option) => (
									<option key={`${option.name} option`} value={option.name}>
										{option.name}
									</option>
								))}
							</select>
						</div>
					</div>
				))
			)}
			{/* TODO : 제외 로직 */}
			<div className={styles.filterGroup}>
				<div className={styles.labelRow}>
					<img
						src="../assets/except.svg"
						alt="exclude icon"
						className={styles.icon}
					/>
					<span className={styles.labelText}>제외</span>
				</div>
				<div className={styles.inputContainer}>
					<input type="text" className={styles.excludeInput} />
					<button type="button" className={styles.applyBtn}>
						적용
					</button>
				</div>
				<div className={styles.tagContainer}>
					{excludeTags.map((tag) => (
						<span key={tag} className={styles.tag}>
							{tag}{" "}
							<button type="button" className={styles.tagClose}>
								x
							</button>
						</span>
					))}
				</div>
			</div>

			{/* TODO : 찜한 행사 & 시간표 */}
			<div className={styles.sectionTitle} style={{ marginTop: "40px" }}>
				페이지
			</div>
			<div className={styles.pageLink}>
				<div className={styles.iconBox} />
				<span>찜한 행사</span>
			</div>
			<div className={styles.pageLink}>
				<div className={styles.iconBox} />
				<span>시간표</span>
			</div>
		</div>
	);
};
