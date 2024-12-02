import myApp from "./app"
import http from "http"
import env from "./config/globalEnv"
import dbConnect from "./config/database"



// create a server
const server = http.createServer(myApp)

// listen server
server.listen(env.PORT, async () => {
    await dbConnect()

    console.log(`Server is running on this port ${env.PORT}`);
    
})