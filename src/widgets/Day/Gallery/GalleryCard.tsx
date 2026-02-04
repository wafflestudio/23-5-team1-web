import CardView from "@widgets/Month/MonthSideView/CardView";
import type { Event } from "@types";
import { useDetail } from "@/contexts/DetailContext";

const GalleryCard = ({ event }: { event: Event }) => {
	const { setShowDetail, setClickedEventId } = useDetail();

	const handleClick = () => {
		setShowDetail(true);
		setClickedEventId(event.id);
	};

	return (
		// biome-ignore lint/a11y/useSemanticElements: div cannot be button because CardView inside has a button in it, and button nested inside buttons are more to be avoided
		<div
			role="button"
			key={event.id}
			tabIndex={0}
			onClick={handleClick}
			onKeyDown={(e) => e.key === "Enter" && handleClick}
			>
			<div
			style={{
				width: "100%",
				aspectRatio: "16 / 9",
				borderRadius: "12px",
				marginBottom: "16px",
				overflow: "hidden",
				border: "1px solid #f0f0f0",
				backgroundColor: "#f9f9f9", 
				position: "relative"				
			}}
			>
			<img
				alt={`thumbnail of ${event.title}`}
				src={event.imageUrl}
				style={{
						width: "100%",
						height: "100%", 
						objectFit: "cover",
						position: "absolute",
						top: 0,
						left: 0
						}}
			/>
			</div>
			<CardView event={event} />
		</div>
	);
};

export default GalleryCard;
