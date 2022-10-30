import React from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import { useState, useEffect, useCallback } from "react";
import AddMovie from "./components/AddMovie";

function App() {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	// usually we should add the fetchMoviesHandler function as a dependency, but since in our case it won't change, we can ommit it; but there might be cases when it could change due to external state
	// in those cases, and for best practice, we should wrap the fetchMoviesHandler in a useCallback()
	useEffect(() => {
		fetchMoviesHandler();
	}, []);

	// async/await approach:
	const fetchMoviesHandler = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			//const response = await fetch("https://swapi.dev/api/films");
			const response = await fetch(
				"https://react-http-ac71a-default-rtdb.europe-west1.firebasedatabase.app/movies.json"
			);
			// response also has a "status" field which holds the concrete response status code
			if (!response.ok) {
				// this throw causes the try to enter the catch phase; fetch doesn't throw an error in case it fails, so we either need to do this manually or use an external tool like axios
				throw new Error("Something went wrong!");
			}

			const data = await response.json();

			const loadedMovies = [];

			for (const key in data) {
				loadedMovies.push({
					id: key,
					title: data[key].title,
					openingText: data[key].openingText,
					releaseDate: data[key].release_date,
				});
			}

			// const transformedMovies = data.results.map((movieData) => {
			// 	return {
			// 		id: movieData.episode_id,
			// 		title: movieData.title,
			// 		openingText: movieData.opening_crawl,
			// 		releaseData: movieData.release_date,
			// 	};
			// });
			setMovies(loadedMovies);
			setIsLoading(false);
		} catch (error) {
			setError(error.message);
		}
		setIsLoading(false);
	}, []);
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

	async function addMovieHandler(movie) {
		const response = await fetch(
			"https://react-http-ac71a-default-rtdb.europe-west1.firebasedatabase.app/movies.json",
			{
				method: "POST",
				// JSON.stringify is a built-in JS function that turns a JS object into a json string
				body: JSON.stringify(movie),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		const data = await response.json();
		console.log(data);
		// TODO error handling
	}

	let content = <p>Found no movies.</p>;

	if (movies.length > 0) {
		content = <MoviesList movies={movies} />;
	}

	if (error) {
		content = <p>{error}</p>;
	}

	if (isLoading) {
		content = <p>Loading...</p>;
	}

	return (
		<React.Fragment>
			<section>
				<AddMovie onAddMovie={addMovieHandler} />
			</section>
			<section>
				<button onClick={fetchMoviesHandler}>Fetch Movies</button>
			</section>
			<section>{content}</section>
		</React.Fragment>
	);
}

export default App;
