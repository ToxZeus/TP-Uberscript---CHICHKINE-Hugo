import { fetchMeals } from './meals.js';
import { User, TropPauvreErreur } from './user.js';

const mainTitle = document.querySelector('h1');

const userSection = document.createElement('div');
userSection.className = 'row mb-5';
userSection.innerHTML = `
    <div class="col-12">
        <div class="card shadow border-info">
            <div class="card-body">
                <h4 class="card-title">Espace de <span id="userName"></span></h4>
                <h5 class="text-primary mb-3">Portefeuille : <span id="walletDisplay"></span> €</h5>
                <p class="text-muted mb-3">Total dépensé : <span id="totalSpentDisplay">0.00</span> €</p>
                
                <h6>Historique des commandes :</h6>
                <ul id="historyList" class="list-group"></ul>
            </div>
        </div>
    </div>
`;
mainTitle?.insertAdjacentElement('afterend', userSection);

const walletDisplay = document.getElementById('walletDisplay') as HTMLSpanElement;
const userName = document.getElementById('userName') as HTMLSpanElement;
const historyList = document.getElementById('historyList') as HTMLUListElement;

function updateUserUI(user: User) {
    const userName = document.getElementById('userName') as HTMLSpanElement;
    const walletDisplay = document.getElementById('walletDisplay') as HTMLSpanElement;
    const historyList = document.getElementById('historyList') as HTMLUListElement;
    const totalSpentDisplay = document.getElementById('totalSpentDisplay') as HTMLSpanElement;

    userName.textContent = user.name;
    walletDisplay.textContent = user.wallet.toFixed(2);

    if (totalSpentDisplay) {
        totalSpentDisplay.textContent = user.getTotalSpent().toFixed(2);
    }

    historyList.innerHTML = '';

    if (user.orders.length === 0) {
        historyList.innerHTML = '<li class="list-group-item text-muted">Aucune commande pour le moment.</li>';
    } else {
        [...user.orders].reverse().forEach(order => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';

            const mealNames = order.meals.map(m => m.name).join(', ');
            li.innerHTML = `
                <span>Commande #${order.id} : <strong>${mealNames}</strong></span>
                <div>
                    <span class="badge bg-secondary rounded-pill me-2">${order.total} €</span>
                    <button class="btn btn-sm btn-outline-danger btn-delete">X</button>
                </div>
            `;

            const deleteBtn = li.querySelector('.btn-delete') as HTMLButtonElement;
            deleteBtn.addEventListener('click', () => {
                if (confirm(`Voulez-vous vraiment annuler la commande #${order.id} ?`)) {
                    user.removeOrder(order.id);
                    updateUserUI(user);
                }
            });

            historyList.appendChild(li);
        });
    }
}

async function init() {
    const myUser = new User(1, "Bob", 30);

    updateUserUI(myUser);

    const meals = await fetchMeals();

    const mealListElement = document.getElementById('mealList') as HTMLUListElement;

    if (!mealListElement) return;

    if (meals.length === 0) {
        mealListElement.innerHTML = '<li class="list-group-item text-danger">Erreur lors du chargement des repas.</li>';
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
                updateUserUI(myUser);
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