import { Meal } from './meals.js';

export type Order = {
    id: number;
    meals: Meal[];
    total: number;
};

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
}