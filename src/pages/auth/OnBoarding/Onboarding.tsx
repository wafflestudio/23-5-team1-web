import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getCategoryGroups, getOrganizations } from "@api/event";
import { addInterestCategories } from "@api/user";
import type { Category } from "@types";

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
	const [selectedPreferences, setSelectedPreferences] = useState<Category[]>(
		[],
	);
	const [organizations, setOrganizations] = useState<Category[] | null>(null);

	useEffect(() => {
		getCategoryGroups().then((categoryGroups) => {
			const safe = Array.isArray(categoryGroups) ? categoryGroups : [];

			// 프로그램 유형(groupId === 3)만 추출
			const programTypes = safe
				.flatMap((item) => item.categories ?? [])
				.filter((c) => c.groupId === 3);

			setCategories(programTypes);
		});
	}, []);

	useEffect(() => {
		getOrganizations().then((orgs) => {
			setOrganizations(Array.isArray(orgs) ? orgs : []);
		});
	}, []);

	const MAX_PREFERENCE = 3;

	const togglePreference = (pref: Category) => {
		setSelectedPreferences((prev) => {
			const exists = prev.some(
				(p) => p.id === pref.id && p.groupId === pref.groupId,
			);

			if (exists) {
				return prev.filter(
					(p) => !(p.id === pref.id && p.groupId === pref.groupId),
				);
			}

			if (prev.length >= MAX_PREFERENCE) {
				alert(`최대 ${MAX_PREFERENCE}개까지 선택할 수 있습니다.`);
				return prev;
			}

			return [...prev, pref];
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
