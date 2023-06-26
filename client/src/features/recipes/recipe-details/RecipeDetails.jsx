import {
	useContext,
	useMemo, useCallback, useState, useEffect, useRef,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Store from '../../../store';
import PageContainer from '../../common/page-container/PageContainer';
import { capitalize } from '../../common/utils';
import Rating from '../../rating/Rating';
import styles from './recipe-details.module.scss';

export default function RecipeDetails() {
	const isAdmin = useRef(localStorage.getItem('isAdmin') === 'true');
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
			navLinks={[isAdmin.current ? {link: 'users', name: 'Utilizatori'} : {link: 'userRecipes', name: 'Retele mele'}]}
		>
			{recipe && (
				<div className={`list-item-container ${styles['recipe-page-container']}`}>
				    <h2 className={styles.title}>Recipe Details</h2>
					<div className={styles['svg-container']}>
						<img className={styles['recipe-image']} src={`http://localhost:8080/uploads/${recipe.imageCover}`} alt="Recipe Cover" />
					</div>
					<div className={styles['recipe-body-container']}>
						<div className={styles['details-container']}>
							<div className={styles.row}
							>
								<p>Nume:</p>
								<span>{capitalize(recipe.name)}</span>
							</div>
							<div className={styles.row}
							>
								<p>Categorie:</p>
								<span>{capitalize(recipe.category)}</span>
							</div>
							<div className={styles.row}
							>
								<p>Porții:</p>
								<span>{capitalize(recipe.servings)}</span>
							</div>
							<div className={styles.row}
							>
								<p>Timpul de gătit:</p>
								<span>{capitalize(recipe.cookingTime)}</span>
							</div>
							<div className={styles.row}
							>
								<p>Dificultate:</p>
								<span>{capitalize(recipe.difficulty)}</span>
							</div>
							<div className="ingrediente">
								<ul>
									{recipe.ingredients?.split(',').map(ingr => <li>{ingr}</li>)}
								</ul>
							</div>
							<div className={styles.row}
							>
								<p>Modul de preparare:</p>
								<span>{capitalize(recipe.description)}</span>
							</div>
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
						</div>
					</div>
				</div>
			)}
		</PageContainer>
	);
}