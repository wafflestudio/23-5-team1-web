import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getCategoryGroups, getOrganizations } from "../../../api/event";
import { addInterestCategories } from "../../../api/user";
import type { Category, CategoryGroup } from "../../../util/types";

export default function Onboarding() {
	const [, setSearchParams] = useSearchParams();

	const handleSubmit = async () => {
		try {
			const items = selectedPreferences.map((p, index) => ({
				categoryId: p.id,
				priority: index + 1,
			}));

			await addInterestCategories(items);

			setSearchParams((prev) => {
				const next = new URLSearchParams(prev);
				next.set("step", "complete");
				return next;
			});
		} catch (e) {
			console.error(e);
			alert("저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
		}
	};

	const [categories, setCategories] = useState<Category[]>([]);
	const [selectedPreferences, setSelectedPreferences] = useState<
		CategoryGroup[]
	>([]);
	const [organizations, setOrganizations] = useState<Category[] | null>(null);

	useEffect(() => {
		getCategoryGroups().then((categoryGroups) => {
			const categoryOnly = categoryGroups
				.flatMap((item) => item.categories)
				.filter((category) => category.groupId === 3);
			setCategories(categoryOnly);
		});
	}, []);
	useEffect(() => {
		getOrganizations().then((categories) => {
			setOrganizations(categories);
		});
	}, []);

	const MAX_PREFERENCE = 3;

	const togglePreference = (preference: CategoryGroup) => {
		setSelectedPreferences((prev) => {
			if (prev.includes(preference)) {
				// 이미 선택된 경우, 제외
				return prev.filter((p) => p.id !== preference.id);
			} else {
				// 선택되지 않은 경우, 추가
				if (prev.length >= MAX_PREFERENCE) {
					alert(`최대 ${MAX_PREFERENCE}개까지 선택할 수 있습니다.`);
					return prev; // 최대 선택 개수 초과 시 무시
				}
				return [...prev, preference];
			}
		});
	};
	return (
		<div className="onb-page">
			<div>
				<h1>관심사 설정</h1>
				<p>먼저 보고 싶은 행사의 카테고리 또는 주체기관을 선택해주세요.</p>
			</div>

			<div>
				{selectedPreferences.map((preference) => {
					return <span key={preference.id}>{preference.name}</span>;
				})}
			</div>

			<section>
				<h2>카테고리</h2>
				<div>
					{categories.map((category) => {
						const checked = selectedPreferences.some(
							(p) => p.id === category.id,
						);
						const id = `category-${category.id}`;

						return (
							<div key={category.id}>
								<input
									type="checkbox"
									id={id}
									checked={checked}
									onChange={() => togglePreference(category)}
								/>
								<label htmlFor={id}>{category.name}</label>
							</div>
						);
					})}
				</div>
			</section>
			<section>
				<h2>주최 기관</h2>
				<div>
					{organizations?.map((org) => {
						const checked = selectedPreferences.some((p) => p.id === org.id);
						const id = `organization-${org.id}`;
						return (
							<div key={org.id}>
								<input
									type="checkbox"
									id={id}
									checked={checked}
									onChange={() => togglePreference(org)}
								/>
								<label htmlFor={id}>{org.name}</label>
							</div>
						);
					})}
					{!organizations && <div>로딩 중..</div>}
				</div>
			</section>
			<button type="button" onClick={handleSubmit}>
				완료
			</button>
		</div>
	);
}
