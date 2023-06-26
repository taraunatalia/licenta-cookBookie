import {
	useEffect, useCallback, useContext, useState, useMemo,
} from 'react';
import Store from '../../store';
import useFetch from '../common/hooks/useFetch';
import AddRecipeDialog from './recipe-dialogs/AddRecipeDialog';
import ConfirmRecipeDeleteDialog from './recipe-dialogs/ConfirmRecipeDeleteDialog';
import styles from './recipes.module.scss';
import RecipeList from './recipe-list/RecipeList';

export default function ManageRecipes(){
    const [recipes, setRecipes]= useState([]);
    const customFetch = useFetch();
    const store = useContext(Store);
    const [addRecipeOpen, setAddRecipeOpen]= useState(false);
	const [recipeToDelete, setRecipeToDelete] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState("");
	const [ratingFilter, setRatingFilter] = useState(0);

    const getRecipes = useCallback( () => {
        const loadData = async () => {
        const res = await customFetch ('http://localhost:8080/admin/recipe',{
            method:'GET',
        });
        if(res.status === 200){
            const result = await res.json();
            setRecipes(result.recipes);
        }
    }
    loadData();
    }, []);

    useEffect(getRecipes, []);

    const onRecipeAdded = useCallback(() => {
        getRecipes();
        setAddRecipeOpen(false);
    }, []);

    const deleteRecipe = useCallback(async () => {
		setRecipeToDelete(null);
		const res = await customFetch('http://localhost:8080/admin/recipe', {
			method: 'DELETE',
			body: JSON.stringify({ recipeId: recipeToDelete._id }),
		});
		if (res.status === 200) {
			store.addToast({ message: 'Recipe deleted successfully!' });
			getRecipes();
		}
	}, [recipeToDelete, store]);

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

    const addButton = (
        <button
          className='primary-btn'
          onClick={() => setAddRecipeOpen(true)}
          type="button"
        >
        Adauga Reteta
        </button>
    );

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
						<div className={styles['rating-label']}>Rating minim</div>
						<select className={styles.rating}
							value={ratingFilter || ''}
							onChange={(e) => setRatingFilter(parseFloat(e.target.value))}
						>

							 <option value="-">0</option>
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
			<RecipeList
				recipes={filteredRecipes}
				headerAction={addButton}
				isAdmin
				mainAction={setRecipeToDelete}
			/>
			<AddRecipeDialog
				cancel={() => setAddRecipeOpen(false)}
				onRecipeAdded={onRecipeAdded}
				opened={addRecipeOpen}
			/>
            <ConfirmRecipeDeleteDialog
				recipe={recipeToDelete}
				cancel={() => setRecipeToDelete(null)}
				onConfirm={deleteRecipe}
			/>
		</>
    )
}