import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import http from 'http'
import ErrorHandler from './middlewears/errorHandler'
import userRouter from './routes/userRoutes'

dotenv.config()

//cors
const app = express();
app.use(
  cors({
    origin: "*",
  })
);

//parse data into json
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
  })
);

const port = process.env.PORT || 5000;
app.get("/", (req, res) => {
    res.send("Crypto currency deals backend");
  });

app.use('/api/users',userRouter)


  //Error handling middlewear
  app.use(ErrorHandler)

  const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Crypto Currency Deals listening at http://localhost:${port}`);
  });