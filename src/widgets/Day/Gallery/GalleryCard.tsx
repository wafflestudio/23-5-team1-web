import CardView from "@widgets/Month/MonthSideView/CardView";
import type { Event } from "@types";

const GalleryCard = ({ event }: { event: Event }) => {
	return (
		<div>
			<img
				alt={`thumbnail of ${event.title}`}
				src={event.imageUrl}
				style={{
					width: "100%",
					height: "auto",
					aspectRatio: 16 / 9,
					objectFit: "cover",
					borderRadius: "12px",
					marginBottom: "16px",
					border: "1px solid #f0f0f0",
				}}
			/>
			<CardView event={event} />
		</div>
	);
};

export default GalleryCard;
