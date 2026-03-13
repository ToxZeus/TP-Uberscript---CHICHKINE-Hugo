import { Meal } from './meals.js';

export type Order = {
    id: number;
    meals: Meal[];
    total: number;
};

export class TropPauvreErreur extends Error {
    constructor(message: string) {
        super(message);
        this.name = "TropPauvreErreur";
    }
}

export class User {
    id: number;
    name: string;
    wallet: number;
    orders: Order[];

    constructor(id: number, name: string, wallet: number) {
        this.id = id;
        this.name = name;
        this.wallet = wallet;
        this.orders = [];
    }

    orderMeal(meal: Meal) {
        if (this.wallet < meal.price) {
            throw new TropPauvreErreur(`Fonds insuffisants. Solde: ${this.wallet}€ | Prix du repas: ${meal.price}€`);
        }

        this.wallet -= meal.price;

        const newOrder: Order = {
            id: Date.now(),
            meals: [meal],
            total: meal.price
        };

        this.orders.push(newOrder);
    }
}