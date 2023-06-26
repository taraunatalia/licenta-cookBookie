import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import { useMemo } from 'react';
import './App.scss'
//import Store from './store';
import useToasts from './features/common/toasts/useToasts';
import Home from './features/home/Home';
import Register from './features/auth/Register';
import Login from './features/auth/Login';
import UserRecipes from './features/user-recipes/UserRecipes';
import Recipes from './features/recipes/Recipes';
import RecipeDetails from './features/recipes/recipe-details/RecipeDetails';
import ManageUsers from './features/users/ManageUsers';
import UserProfile from './features/users/UserProfile';

function App() {
  const [addToast, removeToast, ToastContainer] = useToasts();

  const contextValue = useMemo(() => ({
    addToast,
    removeToast,
  }), [addToast, removeToast]);

  return (
    <BrowserRouter>
      <Routes>
      <Route
						element={<Home />}
						exact
						path="/"
					/>
      <Route
						element={<Register />}
						path="/register"
					/>
        <Route
          element={ <Login />}
          path="/login"
        />
         <Route
          element={ <Recipes />}
          path="/recipes"
        />
        <Route
          element={ <UserRecipes />}
          path="/userRecipes"
        />
        <Route
						element={<RecipeDetails />}
						path="/recipe/:recipeId"
				/>
        <Route
						element={<ManageUsers />}
						path="/users"
				/>
        <Route
          element={ <UserProfile />}
          path="/profile"
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
