import React from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import { useState } from "react";

function App() {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	// async/await approach:
	async function fetchMoviesHandler() {
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch("https://swapi.dev/api/films");
			// response also has a "status" field which holds the concrete response status code
			if (!response.ok) {
				// this throw causes the try to enter the catch phase; fetch doesn't throw an error in case it fails, so we either need to do this manually or use an external tool like axios
				throw new Error("Something went wrong!");
			}

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
			setIsLoading(false);
		} catch (error) {
			setError(error.message);
		}
		setIsLoading(false);
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
				{!isLoading && movies.length > 0 && (
					<MoviesList movies={movies} />
				)}
				{!isLoading && movies.length === 0 && <p>Found no movies!</p>}
				{isLoading && <p>Loading...</p>}
				{!isLoading && error && <p>{error}</p>}
			</section>
		</React.Fragment>
	);
}

export default App;
