import React, { useState } from "react";
import { FaLeaf, FaInfoCircle, FaCheckCircle } from "react-icons/fa";
import PlantationForm from "../components/PlantationForm";
import ProtectedRoute from "../components/common/ProtectedRoute";

export default function CarbonCredits() {
	const [showInfo, setShowInfo] = useState(false);

	return (
		<ProtectedRoute>
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
						
						{/* Info Button */}
						<button
							onClick={() => setShowInfo(!showInfo)}
							className="inline-flex items-center mt-6 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-100 rounded-lg hover:bg-emerald-200 transition-colors"
						>
							<FaInfoCircle className="mr-2" />
							How Carbon Credits Work
						</button>
					</div>

					{/* Info Panel */}
					{showInfo && (
						<div className="mb-8 p-6 bg-white rounded-xl shadow-lg border border-emerald-200">
							<h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
								<FaCheckCircle className="mr-2 text-emerald-600" />
								Carbon Credit Process
							</h3>
							<div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
								<div>
									<h4 className="font-semibold text-emerald-700 mb-2">1. Submission & Verification</h4>
									<ul className="space-y-1">
										<li>• Submit plantation details with location and documentation</li>
										<li>• AI agents verify authenticity and compliance</li>
										<li>• Manual review by environmental experts</li>
									</ul>
								</div>
								<div>
									<h4 className="font-semibold text-emerald-700 mb-2">2. Carbon Credit Generation</h4>
									<ul className="space-y-1">
										<li>• Calculate carbon sequestration potential</li>
										<li>• Issue verified carbon credits</li>
										<li>• List on carbon credit marketplace</li>
									</ul>
								</div>
								<div>
									<h4 className="font-semibold text-emerald-700 mb-2">3. Benefits & Rewards</h4>
									<ul className="space-y-1">
										<li>• Earn points for environmental contribution</li>
										<li>• Generate income from carbon credit sales</li>
										<li>• Contribute to global climate action</li>
									</ul>
								</div>
								<div>
									<h4 className="font-semibold text-emerald-700 mb-2">4. Monitoring & Maintenance</h4>
									<ul className="space-y-1">
										<li>• Regular satellite monitoring</li>
										<li>• Survival rate tracking</li>
										<li>• Ongoing verification processes</li>
									</ul>
								</div>
							</div>
						</div>
					)}

					<div className="p-8 overflow-hidden bg-white shadow-2xl rounded-3xl backdrop-blur-sm bg-opacity-95">
						<PlantationForm />
					</div>

					{/* Additional Information */}
					<div className="mt-8 p-6 bg-emerald-50 rounded-xl border border-emerald-200">
						<h3 className="text-lg font-semibold text-emerald-800 mb-3 flex items-center">
							<FaLeaf className="mr-2" />
							Why Mangrove Plantations?
						</h3>
						<div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
							<div>
								<h4 className="font-semibold text-emerald-700">Carbon Sequestration</h4>
								<p>Mangroves can store up to 4 times more carbon than terrestrial forests</p>
							</div>
							<div>
								<h4 className="font-semibold text-emerald-700">Coastal Protection</h4>
								<p>Natural barriers against storms, erosion, and sea level rise</p>
							</div>
							<div>
								<h4 className="font-semibold text-emerald-700">Biodiversity</h4>
								<p>Critical habitat for marine life and migratory species</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</ProtectedRoute>
	);
}
