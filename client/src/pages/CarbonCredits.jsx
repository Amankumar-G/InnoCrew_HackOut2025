import React from "react";
import PlantationForm from "../components/PlantationForm";

export default function CarbonCredits() {
	return (
		<div className="min-h-screen px-4 py-12 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
			<div className="max-w-4xl mx-auto">
				<div className="mb-12 text-center">
					<div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full shadow-lg bg-gradient-to-r from-emerald-600 to-green-600">
						<span className="text-3xl text-white">🌱</span>
					</div>
					<h1 className="mb-4 text-5xl font-bold text-transparent bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text">
						Register Plantation for Carbon Credits
					</h1>
					<p className="max-w-2xl mx-auto text-lg text-gray-600">
						Submit details of your mangrove plantation project to start the carbon credit verification and generation process.
					</p>
				</div>
				<div className="p-8 overflow-hidden bg-white shadow-2xl rounded-3xl backdrop-blur-sm bg-opacity-95">
					<PlantationForm />
				</div>
			</div>
		</div>
	);
}
