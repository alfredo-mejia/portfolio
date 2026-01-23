import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {AppInitializationError} from './errors/AppError.ts'

const domRoot = document.getElementById('root');

if (!domRoot) {
    throw new AppInitializationError('Root element not found');
}

const reactRoot = createRoot(domRoot)
reactRoot.render(
    // Strict mode is used to highlight potential problems in an application while developing.
    // In production, it is ignored.
    <StrictMode>
        <App />
    </StrictMode>
)
