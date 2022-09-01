import App from './app'
import { initMeeetupRoutes } from './routes/meetup'

const app = new App([initMeeetupRoutes()])

app.listen()