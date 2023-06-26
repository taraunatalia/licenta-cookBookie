import {
	useContext,
	useMemo, useCallback, useState, useEffect,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Store from '../../../store';
import PageContainer from '../../common/page-container/PageContainer';
import { capitalize } from '../../common/utils';
import Rating from '../../rating/Rating';
import styles from './recipe-details.module.scss';

export default function RecipeDetails({ isAdmin = false }) {
	const { recipeId } = useParams();
	const [recipe, setRecipe] = useState(null);
	const [rating, setRating] = useState(0);
	const [ratings, setRatings] = useState([]);
	const store = useContext(Store);
	const navigate = useNavigate();
	const [updatedRecipe, setUpdatedRecipe] = useState({});

	useEffect(() => {
		if (recipe === undefined) {
			navigate('/');
			return;
		}
		setUpdatedRecipe({ ...recipe });
	}, [recipe]);

	const getRecipe = useCallback(async () => {
		const token = localStorage.getItem('auth-token');
		const res = await fetch(`http://localhost:8080/recipe/${recipeId}`,{
			method: 'GET',
            headers: {
                'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
            },
		});
		if (res.status === 200) {
			const result = await res.json();
			setRecipe(result.recipe);
		}
	}, [recipeId]);

	const getRatings = useCallback(async () => {
		const token = localStorage.getItem('auth-token');
		const ratingUrl = new URL(`http://localhost:8080/ratings/${recipeId}`);
		const res = await fetch(ratingUrl, {
			method: 'GET',
            headers: {
                'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
            },
		});
		if (res.status === 200) {
			const result = await res.json();
			setRatings(result.ratings);
		}
	}, [recipeId]);

	useEffect((() => {
		getRecipe();
		getRatings();
	}), [recipeId]);

	const myRating = useMemo(() => ratings.find((r) => r.currentUser)?.rating, [ratings]);

	useEffect(() => {
		if (myRating) {
			setRating(myRating);
		}
	}, [myRating]);

	const saveRating = useCallback(async () => {
		const newRating = {
			recipe: recipeId,
			rating,
		};
		const token = localStorage.getItem('auth-token');
		const res = await fetch('http://localhost:8080/rating', {
			method: myRating ? 'PATCH' : 'POST',
			headers: {
                'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
            },
			body: JSON.stringify(newRating),
		});
		if (res.status === 200) {
			store.addToast({
				message: `Rating ${myRating ? 'updated' : 'saved'} successfully!`,
				type: 'success',
			});
			getRecipe();
			getRatings();
		}
	}, [rating, myRating, store]);

	const handleRecipeUpdate = useCallback((e, field, type = 'value') => {
		setUpdatedRecipe({
			...updatedRecipe,
			[field]: e.target[type],
		}, [updatedRecipe]);
	});

	const canUpdate = useMemo(
		() => updatedRecipe?.name !== recipe?.name
		|| updatedRecipe?.category !== recipe?.category
		|| updatedRecipe?.servings !== recipe?.servings
		|| updatedRecipe?.ingredients !== recipe?.ingredients
		|| updatedRecipe?.cookingTime !== recipe?.cookingTime
		|| updatedRecipe?.difficulty !== recipe?.difficulty
		|| updatedRecipe?.description !== recipe?.description
		|| updatedRecipe?.private !== recipe?.private,
		[updatedRecipe, recipe],
	);

	const updateRecipe = useCallback(async () => {
		if (!canUpdate) {
			return;
		}
		const body = {
			...updatedRecipe,
			recipeId: updatedRecipe._id,
		};
		const res = await customFetch('http://localhost:8080/recipe', {
			method: 'PATCH',
			body: JSON.stringify(body),
		});
		if (res.status === 200) {
			store.addToast({ message: 'Recipe updated successfully!' });
			navigate('/');
		}
	}, [updatedRecipe, canUpdate, store]);

	const keyPressHandler = (e) => {
		if (e.key === 'Enter') {
			updateRecipe();
		}
	};

	return (
		<PageContainer
			loggedIn
			navLinks={['UserRecipes']}
		>
			{recipe && (
				<div className={`list-item-container ${styles['recipe-page-container']}`}>
				    <h2 className={styles.title}>{isAdmin ? 'Edit recipe' : 'Recipe Details'}</h2>
					<div className={styles['recipe-body-container']}>
					<div className={styles['svg-container']}>
					<img className={styles['svg-container']} src={`data:${recipe.mimetype};base64,${recipe.imageCover}`} alt="Recipe Cover" />
					</div>
						<div className={styles['details-container']}>
							<div className={`${styles.row} ${isAdmin
								? styles['input-container'] : ''}`}
							>
								<p>Nume:</p>
								{isAdmin ? updatedRecipe?.name && (
									<input
										className="form-control"
										id="model"
										name="model"
										onChange={(e) => handleRecipeUpdate(e, 'name')}
										onKeyPress={keyPressHandler}
										placeholder="Nume rețetă"
										required
										type="text"
										value={updatedRecipe.name}
									/>
								) : (
									<span>{capitalize(recipe.name)}</span>
								)}
							</div>
							<div className={`${styles.row} ${isAdmin
								? styles['input-container'] : ''}`}
							>
								<p>Categorie:</p>
								{isAdmin ? updatedRecipe?.category && (
									<input
										className="form-control"
										id="color"
										name="color"
										onChange={(e) => handleRecipeUpdate(e, 'category')}
										onKeyPress={keyPressHandler}
										placeholder="Categoria"
										required
										type="text"
										value={updatedRecipe.category}
									/>
								) : (
									<span>{capitalize(recipe.category)}</span>
								)}
							</div>
							<div className={`${styles.row} ${isAdmin
								? styles['input-container'] : ''}`}
							>
								<p>Porții:</p>
								{isAdmin ? updatedRecipe?.servings && (
									<input
										className="form-control"
										id="location"
										name="location"
										onChange={(e) => handleRecipeUpdate(e, 'servings')}
										onKeyPress={keyPressHandler}
										placeholder="Numărul de porții"
										required
										type="text"
										value={updatedRecipe.servings}
									/>
								) : (
									<span>{capitalize(recipe.servings)}</span>
								)}
							</div>
							<div className={`${styles.row} ${isAdmin
								? styles['input-container'] : ''}`}
							>
								<p>Timpul de gătit:</p>
								{isAdmin ? updatedRecipe?.cookingTime && (
									<input
										className="form-control"
										id="cookingTime"
										name="cookingTime"
										onChange={(e) => handleRecipeUpdate(e, 'cookingTime')}
										onKeyPress={keyPressHandler}
										placeholder="2h"
										required
										type="text"
										value={updatedRecipe.cookingTime}
									/>
								) : (
									<span>{capitalize(recipe.cookingTime)}</span>
								)}
							</div>
							<div className={`${styles.row} ${isAdmin
								? styles['input-container'] : ''}`}
							>
								<p>Dificultate:</p>
								{isAdmin ? updatedRecipe?.difficulty && (
									<input
										className="form-control"
										id="difficulty"
										name="difficulty"
										onChange={(e) => handleRecipeUpdate(e, 'difficulty')}
										onKeyPress={keyPressHandler}
										placeholder="greu"
										required
										type="text"
										value={updatedRecipe.difficulty}
									/>
								) : (
									<span>{capitalize(recipe.difficulty)}</span>
								)}
							</div>
							<div className="ingrediente">
								<ul>
									{recipe.ingredients?.split(',').map(ingr => <li>{ingr}</li>)}
								</ul>
							</div>
							<div className={`${styles.row} ${isAdmin
								? styles['input-container'] : ''}`}
							>
								<p>Modul de preparare:</p>
								{isAdmin ? updatedRecipe?.description && (
									<input
										className="form-control"
										id="description"
										name="description"
										onChange={(e) => handleRecipeUpdate(e, 'description')}
										onKeyPress={keyPressHandler}
										placeholder="descriere"
										required
										type="text"
										value={updatedRecipe.description}
									/>
								) : (
									<span>{capitalize(recipe.description)}</span>
								)}
							</div>
							{isAdmin ? (
								<>
									{updatedRecipe?.private !== undefined && (
										<div className={`${styles.row} ${
											styles['input-container']}`}
										>
											<label>
												<input
													checked={updatedRecipe.private}
													id="available"
													name="available"
													onChange={(e) => handleRecipeUpdate(
														e,
														'private',
														'checked',
													)}
													type="checkbox"
												/>
												Private
											</label>
										</div>
									)}
									<div className={styles['update-btn-container']}>
										<button
											className="primary-btn"
											disabled={!canUpdate}
											onClick={updateRecipe}
											type="button"
										>
											Actualizare
										</button>
									</div>
								</>
							) : (
								<>
									<div className={styles.row}>
										<p>Rating:</p>
										<span>{`${recipe.rating || 'N/A'} (${ratings.length})`}</span>
									</div>
									<div className={styles.ratings}>
										<div className={styles.rate}>
											<p>My rating</p>
											<div className={styles['rate-actions']}>
												<Rating
													updateValue={setRating}
													value={rating}
												/>
												<button
													className={`primary-btn ${styles.primary}`}
													disabled={myRating === rating || rating === 0}
													onClick={saveRating}
													type="button"
												>
													Rate
												</button>
											</div>
										</div>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</PageContainer>
	);
}