import {
	useMemo, useContext, useCallback, useState, useEffect
} from 'react';
import Store from '../../../store';
import Dialog from '../../common/dialog/Dialog';
import styles from './dialogs.module.scss';

export default function AddRecipeDialog({ cancel, opened, onRecipeAdded}){
    const [recipe, setRecipe]= useState({
        name: '',
        category: 'Aperitive',
        servings: '',
        ingredients: '',
        cookingTime: '',
        difficulty: 'usor',
        description: '',
        private: false,
        user: ''
    });
    const [image, setImage] = useState(null);

    const store = useContext(Store);

    useEffect(() => {
        if (!opened) {
          setRecipe({
            name: '',
            category: 'Aperitive',
            servings: '',
            ingredients: '',
            cookingTime: '',
            difficulty: 'usor',
            description: '',
            private: false,
            user: ''
          });
        }
      }, [opened]);
      
    const handleChange = useCallback((e, field) => {
        setRecipe({
            ...recipe,
            [field]: e.target.value,
        });
    }, [recipe]);

    const isValid = useMemo(() => recipe?.name !== '' && recipe?.category !== '' && recipe?.servings !== '' && recipe?.ingredients !== '' && recipe?.cookingTime !== '' && recipe?.difficulty !== '' && recipe?.description !== '' && image !== null, [recipe, image]);

    const createRecipe = useCallback(async () => {
        if(!isValid){
            return;
        }
        const token = localStorage.getItem('auth-token');
        const data = new FormData();
        Object.entries(recipe).forEach(([key, value]) => {
            data.set(key, value);
        });
        data.set('imageCover', image);
        console.log('data', data);
        const res = await fetch ('http://localhost:8080/recipe', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: data,
        });
        if( res.status === 200){
            store.addToast({ message: 'Recipe created successfully!'});
            onRecipeAdded();
        }
    }, [recipe, isValid, store]);

    const keyPressHandler = (e) => {
        if(e.key === 'Enter') {
            createRecipe();
        }
    };

    return (
        <Dialog
        cancel={{ showCancel: true, callback: cancel }}
        confirm={{ callback: createRecipe, label: 'Adauga reteta', disabled: !isValid }}
        opened={opened}
        title="Adauga reteta"
    >
        <div className={styles['form-container']}>
            <div className="form-group">
                <label htmlFor="model">Nume</label>
                <input
                    className="form-control"
                    id="model"
                    name="model"
                    onChange={(e) => handleChange(e, 'name')}
                    onKeyPress={keyPressHandler}
                    placeholder="Cheesecake"
                    required
                    type="text"
                    value={recipe.name}
                />
            </div>
            <div className="form-group">
                <label htmlFor="color">Categorie</label>
                <select className="form-control"
                       value={recipe.category}
                       onChange={(e) => handleChange(e, 'category')}
					>
                        <option value="Aperitive">Aperitive</option>
                        <option value="Ciorbe si Supa">Ciorbe si Supa</option>
                        <option value="Feluri principale">Feluri principale</option>
                        <option value="Deserturi">Deserturi</option>
                    </select>
            </div>
            <div className="form-group">
                <label htmlFor="location">Portii</label>
                <input
                    className="form-control"
                    id="location"
                    name="location"
                    onChange={(e) => handleChange(e, 'servings')}
                    onKeyPress={keyPressHandler}
                    placeholder="12"
                    required
                    type="text"
                    value={recipe.servings}
                />
            </div>
            <div className="form-group">
                <label htmlFor="model">Ingrediente</label>
                <input
                    className="form-control"
                    id="model"
                    name="model"
                    onChange={(e) => handleChange(e, 'ingredients')}
                    onKeyPress={keyPressHandler}
                    placeholder="Unt, biscuiti,..."
                    required
                    type="text"
                    value={recipe.ingredients}
                />
            </div>
            <div className="form-group">
                <label htmlFor="model">Timp de gatit</label>
                <input
                    className="form-control"
                    id="model"
                    name="model"
                    onChange={(e) => handleChange(e, 'cookingTime')}
                    onKeyPress={keyPressHandler}
                    placeholder="2h"
                    required
                    type="text"
                    value={recipe.cookingTime}
                />
            </div>
            <div className="form-group">
                <label htmlFor="model">Dificultate</label>
                <select className="form-control"
                       value={recipe.difficulty}
                       onChange={(e) => handleChange(e, 'difficulty')}
					>
                        <option value="usor">Usor</option>
                        <option value="mediu">Mediu</option>
                        <option value="dificil">Dificil</option>
                    </select>
            </div>
            <div className="form-group">
                <label htmlFor="model">Descriere</label>
                <input
                    className="form-control"
                    id="model"
                    name="model"
                    onChange={(e) => handleChange(e, 'description')}
                    onKeyPress={keyPressHandler}
                    placeholder="Descriere"
                    required
                    type="text"
                    value={recipe.description}
                />
            </div>
            <div className="form-group">
                <label htmlFor="model">Imagine</label>
                <input
                    accept='image/*'
                    className="form-control"
                    multiple={false}
                    id="imageCover"
                    name="imageCover"
                    onChange={(e) => setImage(e.target.files[0])}
                    placeholder="text.jpg"
                    required
                    type="file"
                />
            </div>
            <div className={styles.available}>
                <label>
                    <input
                        checked={recipe?.private}
                        id="available"
                        name="available"
                        onChange={(e) => setRecipe({ ...recipe, private: e.target.checked })}
                        type="checkbox"
                    />
                    Privata
                </label>
            </div>
        </div>
    </Dialog>
    )
}