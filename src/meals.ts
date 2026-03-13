export type Meal = {
    id: number;
    name: string;
    calories: number;
    price: number;
};

export async function fetchMeals(): Promise<Meal[]> {
    try {
        const response = await fetch("https://keligmartin.github.io/api/meals.json");
        if (!response.ok) {
            throw new Error("Erreur réseau");
        }
        const meals: Meal[] = await response.json();
        return meals;
    } catch (error) {
        console.error("Erreur lors du chargement des repas");
        return [];
    }
}