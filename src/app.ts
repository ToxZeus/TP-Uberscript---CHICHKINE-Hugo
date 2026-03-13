import { fetchMeals } from './meals.js';
import { User, TropPauvreErreur } from './user.js';

async function init() {
    const myUser = new User(1, "Bob", 30);

    const meals = await fetchMeals();

    const mealListElement = document.getElementById('mealList') as HTMLUListElement;

    if (!mealListElement) return;

    if (meals.length === 0) {
        mealListElement.innerHTML = '<li class="list-group-item text-danger">Aucun repas disponible. Réessayez plus tard.</li>';
        return;
    }

    mealListElement.innerHTML = '';

    meals.forEach(meal => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';

        const mealText = document.createElement('span');
        mealText.innerHTML = `<strong>${meal.name}</strong> - ${meal.price}€`;

        const orderBtn = document.createElement('button');
        orderBtn.className = 'btn btn-sm btn-primary';
        orderBtn.textContent = 'Commander';

        orderBtn.addEventListener('click', () => {
            try {
                myUser.orderMeal(meal);
                alert(`Commande de ${meal.name} réussie ! Nouveau solde: ${myUser.wallet}€`);
                console.log("Historique des commandes :", myUser.orders);
            } catch (error) {
                if (error instanceof TropPauvreErreur) {
                    alert(`Erreur : ${error.message}`);
                } else {
                    console.error(error);
                }
            }
        });

        li.appendChild(mealText);
        li.appendChild(orderBtn);
        mealListElement.appendChild(li);
    });
}

init();