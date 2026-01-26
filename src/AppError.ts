class AppInitializationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AppInitializationError';
    }
}

export {
    AppInitializationError
}