import app from './src/app.js'
import connectDB from './src/config/db.js'


//Connect Mongo Database
connectDB();

//listen for client request
app.listen(3000,() => { console.log(`Running✔️ ...`);});