import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ZoomControl } from 'react-leaflet'
import './App.css';

import L from 'leaflet';

const createCustomIcon = (width = 30, height = 40) => {
	const pinPath = "M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z";
	const holePath = "M 192 132 a 60 60 0 1 0 0 120 a 60 60 0 1 0 0 -120";
	const svgString = `
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="${width}" height="${height}">
			<path 
				fill="#f1c40f" 
				stroke="#333" 
				stroke-width="15" 
				fill-rule="evenodd"
				d="${pinPath} ${holePath}"
			/>
		</svg>
	`;

	return L.divIcon({
		className: 'custom-pin-icon',
		html: svgString,
		iconSize: [width, height],
		iconAnchor: [width / 2, height],
		popupAnchor: [0, -height - 5],
	});
};

const markerIcon = createCustomIcon(20, 30);

function App() {
	const position = [20, 0];
	const mapInstanceRef = useRef(null);
	const [allLocations, setAllLocations] = useState([]);
	const [filteredLocations, setFilteredLocations] = useState([]);
	const [selectedContinents, setSelectedContinents] = useState(new Set());
	const [availableContinents, setAvailableContinents] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const [isDarkMode, setIsDarkMode] = useState(() => {
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme) {
			return savedTheme === 'dark';
		}
		return window.matchMedia('(prefers-color-scheme: dark)').matches;
	});

	const toggleTheme = () => {
		setIsDarkMode(!isDarkMode);
	};

	useEffect(() => {
		localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
	}, [isDarkMode]);

	useEffect(() => {
		const API_URL = '/api/locations';

		fetch(API_URL)
			.then(res => res.json())
			.then(data => {
				setAllLocations(data);
				setFilteredLocations(data);

				const continents = new Set(data.map(item => item.continent).filter(Boolean));
				setAvailableContinents([...continents]);
				setSelectedContinents(continents); // default select all
			})
			.catch(error => console.error("Error:", error))
			.finally(() => {
				setTimeout(() => {
					setIsLoading(false);
				}, 2500);
			});
	}, []);

	const handleCheckboxChange = (continent) => {
		const newSelected = new Set(selectedContinents);
		if (newSelected.has(continent)) {
			newSelected.delete(continent);
		} else {
			newSelected.add(continent);
		}
		setSelectedContinents(newSelected);

		const newFiltered = allLocations.filter(loc => newSelected.has(loc.continent));
		setFilteredLocations(newFiltered);
	};

	return (
		<div
			style={{ position: 'relative', height: '100vh', width: '100%' }}
			data-theme={isDarkMode ? "dark" : "light"}
		>
			<div style={{ position: 'relative', height: '100vh', width: '100%' }}>
				{isLoading && (
					<div className="loading-overlay">
						<div className="earth-spinner"></div>
						<div className="loading-text">UNLOCKING THE EARTH...</div>
					</div>
				)}
				<div className={`sidebar-container ${!isLoading ? 'visible' : ''}`}>
					<div className="sidebar-header">
						<div className="header-top-row">
							<h3>解鎖地球</h3>
							<label className="theme-switch">
								<input
									type="checkbox"
									checked={isDarkMode}
									onChange={toggleTheme}
								/>
								<span className="slider round">
								</span>
							</label>
						</div>
						<span className="subtitle">依洲別篩選</span>
					</div>

					<div className="filter-list">
						{availableContinents.map(continent => (
							<label key={continent} className="custom-checkbox-wrapper">
								<input
									type="checkbox"
									checked={selectedContinents.has(continent)}
									onChange={() => handleCheckboxChange(continent)}
								/>
								<span className="checkmark"></span>
								<span className="label-text">{continent}</span>
							</label>
						))}
					</div>

					<div className="sidebar-footer">
						Showing {filteredLocations.length} locations
					</div>
				</div>
				<div className={`map-wrapper ${!isLoading ? 'visible' : ''}`}>
					<MapContainer
						ref={mapInstanceRef}
						center={position}
						zoom={3}
						minZoom={2}
						maxBounds={[[-90, -180], [90, 180]]}
						maxBoundsViscosity={0.5}
						style={{ height: '100%', width: '100%' }}
						zoomControl={false}
					>
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
							url={isDarkMode
								? "http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png"
								: "http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
							}
						/>

						<ZoomControl position="bottomright" />

						{filteredLocations.map((loc, index) => (
							<Marker key={index} position={[loc.coordinates.lat, loc.coordinates.lng]} icon={markerIcon}>
								<Popup>
									<strong>{loc.name}</strong><br />
									{loc.podcast.title}<br />
									<a href={loc.podcast.url} target="_blank" rel="noopener noreferrer">
										收聽 Podcast
									</a>
								</Popup>
							</Marker>
						))}
					</MapContainer>
				</div>
			</div>
		</div>
	);
}

export default App;
