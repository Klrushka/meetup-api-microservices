import App from './app'
import { initRoutes } from './Routes/authentification'

const app = new App([initRoutes()])

app.listen()

