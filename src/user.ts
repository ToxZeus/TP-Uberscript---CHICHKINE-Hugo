import { Meal } from './meals.js';

export type Order = {
    id: number;
    meals: Meal[];
    total: number;
};

export type MealDraft = Partial<Meal>;

export type NewOrder = Omit<Order, 'id'>;

export class TropPauvreErreur extends Error {
    constructor(message: string, public restant: number, public total: number) {
        super(message);
        this.name = "TropPauvreErreur";
    }
}

export class User {
    id: number;
    name: string;
    wallet: number;
    orders: Order[];

    constructor(id: number, name: string, defaultWallet: number) {
        this.id = id;
        this.name = name;

        const savedWallet = localStorage.getItem(`wallet_${this.id}`);
        const savedOrders = localStorage.getItem(`orders_${this.id}`);

        this.wallet = savedWallet ? parseFloat(savedWallet) : defaultWallet;

        this.orders = savedOrders ? JSON.parse(savedOrders) : [];
    }

    orderMeal(meal: Meal) {
        if (this.wallet < meal.price) {
            throw new TropPauvreErreur(
                `Fonds insuffisants. Solde: ${this.wallet}€ | Prix: ${meal.price}€`,
                this.wallet,
                meal.price
            );
        }

        this.wallet -= meal.price;

        const newOrder: Order = {
            id: Date.now(),
            meals: [meal],
            total: meal.price
        };

        this.orders.push(newOrder);

        this.saveData();
    }

    private saveData() {
        localStorage.setItem(`wallet_${this.id}`, this.wallet.toString());
        localStorage.setItem(`orders_${this.id}`, JSON.stringify(this.orders));
    }

    getTotalSpent(): number {
        return this.orders.reduce((accumulateur, order) => accumulateur + order.total, 0);
    }

    removeOrder(orderId: number) {
        const orderIndex = this.orders.findIndex(order => order.id === orderId);

        if (orderIndex !== -1) {
            const orderToRemove = this.orders[orderIndex];
            this.wallet += orderToRemove.total;
            this.orders.splice(orderIndex, 1);
            this.saveData();
        }
    }
}