interface SeedData {
    entries: SeedEntry[]
}

interface SeedEntry {
    description: string;
    status: string;
    createdAt: number;

}
export const seedData: SeedData = {
    entries: [
        {
            description: 'Esto es un ejemplo de descripcion',
            status: 'pending',
            createdAt: Date.now(),
        },
        {
            description: 'Esto es un ejemplo de descripcion en progreso',
            status: 'in-progress',
            createdAt: Date.now() - 1000000,
        },
        {
            description: 'Esto es un ejemplo de descripcion terminadas',
            status: 'finished',
            createdAt: Date.now() - 100000,
        }
    ]
}