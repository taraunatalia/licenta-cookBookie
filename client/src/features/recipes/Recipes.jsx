import {
	useCallback, useState, useEffect, useMemo,
	useContext,
} from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import useFetch from '../common/hooks/useFetch';
import RecipeList from './recipe-list/RecipeList';
import RecipeFilters from '../filters/RecipeFilters';
import createRecipeFilters from '../filters/createRecipeFilters';
import TryRecipeDialog from './recipe-dialogs/TryRecipeDialog';
import styles from './recipes.module.scss';
import Store from '../../store';

export default function Recipes (){
    const [recipes, setRecipes] = useState([]);
    const customFetch = useFetch();
    const [filters, setFilters] = useState({});
	const [recipeToTry, setRecipeToTry] = useState(null);
    const store = useContext(Store);
	const [categoryFilter, setCategoryFilter] = useState('');
	const [ratingFilter, setRatingFilter] = useState('');


	//retetele publice
    const getAllPublicRecipes = useCallback( () => {
		const loadData = async () => {
        const res = await customFetch('http://localhost:8080/recipes/public');
        if(res.status === 200){
            const result = await res.json();
            setRecipes(result.recipes);
        }
	}
	loadData();
    }, []);

    useEffect(() => {
        getAllPublicRecipes();
    }, []);

	//adaug reteta la favorite
    const tryRecipe = useCallback(async (recipeId) => {
		const token = localStorage.getItem('auth-token');
	    const userRecipe = {
		    recipe: recipeId, 
	    }
        const res = await fetch('http://localhost:8080/recipe/try',{
		    method: 'POST',
			headers: {
                'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
            },
		    body: JSON.stringify(userRecipe),
	    });
		if (res.status === 200) {
			store.addToast({ message: 'Ați adăugat rețeta la favorite!', type: 'success' });
			getAllPublicRecipes();
		}
		setRecipeToTry(null);
    }, [store])

	const filtersData = useMemo(() => createRecipeFilters(recipes), [recipes]);

	//filtrez retetele in functie de categorie si rating
    const filteredRecipes = useMemo(() => recipes.filter((recipe) => {
        if (categoryFilter && ratingFilter) {
            return (
                recipe.category.toLowerCase() === categoryFilter.toLowerCase() &&
                recipe.rating >= ratingFilter
            );
        } else if (categoryFilter) {
            return recipe.category.toLowerCase() === categoryFilter.toLowerCase();
        } else if (ratingFilter) {
            return recipe.rating >= ratingFilter;
        }
        return true;
    }), [categoryFilter, ratingFilter, recipes]);
    
    const openTryRecipeDialog = useCallback((recipeId) => {
		setRecipeToTry(filteredRecipes.find((b) => b._id === recipeId));
	}, [filteredRecipes]);
    return (
        <>
        <div className={`list-item-container ${styles['filter-header']}`}>
				<h2 className={styles.heading}>Filtrează rețetele</h2>
				<div className={styles['date-row']}>
				<div className={styles['date-range-container']}>
				<div className={styles['category-label']}>Categorie</div>
				<select className={styles.category}
                       value={categoryFilter}
                       onChange={(e) => setCategoryFilter(e.target.value)}
					>
                        <option value="">Toate categoriile</option>
                        <option value="Aperitive">Aperitive</option>
                        <option value="Ciorbe si Supa">Ciorbe si Supa</option>
                        <option value="Feluri principale">Feluri principale</option>
                        <option value="Deserturi">Deserturi</option>
                    </select>
					<hr />
                   
				   <div className={styles['rating-row']}>
						<div className={styles['rating-label']}>Rating</div>
						<select className={styles.rating}
							value={ratingFilter || ''}
							onChange={(e) => setRatingFilter(parseFloat(e.target.value))}
						>

							 <option value="-">-</option>
							 <option value="1">1</option>
							 <option value="2">2</option>
							 <option value="3">3</option>
							 <option value="4">4</option>
							 <option value="5">5</option>
					   </select>
				   </div>
	
					</div>
				</div>
			</div>
            <RecipeFilters
					data={filtersData}
					filters={filters}
					setFilters={setFilters}
				/>
			<RecipeList
				recipes={filteredRecipes}
				mainAction={(recipe) => openTryRecipeDialog(recipe._id)}
			/>
			<TryRecipeDialog 
			recipe={recipeToTry}
			cancel={() => setRecipeToTry(null)}
			confirm={() => tryRecipe(recipeToTry._id)}
			/>
        </>
    )
}