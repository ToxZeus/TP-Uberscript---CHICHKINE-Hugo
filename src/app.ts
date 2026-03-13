import { fetchMeals } from './meals.js';
import { User } from './user.js';

async function init() {
    console.log("Démarrage de l'application...");

    // Création d'un utilisateur de test
    const myUser = new User(1, "Bob", 30);
    console.log("Utilisateur initialisé :", myUser);

    // Test de la récupération de l'API
    const meals = await fetchMeals();
    console.log("Repas récupérés :", meals);
}

init();