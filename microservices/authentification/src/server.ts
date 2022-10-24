import App from './app';
import { initRoutes } from './routes/authentification';

const app = new App([initRoutes()]);

app.listen();
