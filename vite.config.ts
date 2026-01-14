import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			"/api": {
				target: "http://13.125.246.220:8080",
				changeOrigin: true,
				secure: false,
			},
		},
	},
});
