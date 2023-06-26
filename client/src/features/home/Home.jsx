import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import useFetch from '../common/hooks/useFetch';
import PageContainer from '../common/page-container/PageContainer';
import Recipes from '../recipes/Recipes';
import UserRecipes from '../user-recipes/UserRecipes';
import ManageRecipes from '../recipes/ManageRecipes';

export default function Home (){
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(undefined);

    useEffect(() => {
        const loadData = async () => {
        const token = localStorage.getItem('auth-token');
        if(!token){
            navigate('/login');
        }
        const res = await fetch ('http://localhost:8080/admin/check', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        }, false);
        setIsAdmin(res.status === 200);
    }
    loadData();
    }, []);

    return(
        <PageContainer navLinks={isAdmin ? [{link: 'users', name: 'Utilizatori'}] : [{link: 'userRecipes', name: 'Retele mele'}]}>
            {isAdmin !== undefined && (isAdmin ? <ManageRecipes /> : <Recipes />)}
        </PageContainer>
    );
}