import React from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import { useState } from "react";

function App() {
	const [movies, setMovies] = useState([]);

	// async/await approach:
	async function fetchMoviesHandler() {
		const response = await fetch("https://swapi.dev/api/films");
		const data = await response.json();
		const transformedMovies = data.results.map((movieData) => {
			return {
				id: movieData.episode_id,
				title: movieData.title,
				openingText: movieData.opening_crawl,
				releaseData: movieData.release_date,
			};
		});
		setMovies(transformedMovies);
	}
	// .then() approach:
	// function fetchMoviesHandler() {
	// 	// we can add a second parameter for fetch(), which can take an object of properties like header, body, method(GET, POST, etc), etc
	// 	// fetch docs: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
	// 	fetch("https://swapi.dev/api/films")
	// 		.then((response) => {
	// 			// response.json() returns a promise, so we can add another .then after this function to handle that promise
	// 			return response.json();
	// 		})
	// 		.then((data) => {
	// 			const transformedMovies = data.results.map((movieData) => {
	// 				return {
	// 					id: movieData.episode_id,
	// 					title: movieData.title,
	// 					openingText: movieData.opening_crawl,
	// 					releaseData: movieData.release_date,
	// 				};
	// 			});
	// 			setMovies(transformedMovies);
	// 		});
	// }

	return (
		<React.Fragment>
			<section>
				<button onClick={fetchMoviesHandler}>Fetch Movies</button>
			</section>
			<section>
				<MoviesList movies={movies} />
			</section>
		</React.Fragment>
	);
}

export default App;
