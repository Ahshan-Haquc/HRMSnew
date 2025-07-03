const express = require("express");
const cors = require("cors");
const createError = require("http-errors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");


const { errorResponse } = require("./controllers/responseController");
const authRouter = require("./routers/authRouter");
const employeRouter = require("./routers/employeeRouter");
const departmentRouter = require("./routers/departmentRouter");

const app = express();


// Middleware
app.use(express.json());
app.use(cors({ origin: '*' }));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || clientUrl.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, '*');
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  })
);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/employee", employeRouter)
app.use("/api/department", departmentRouter)


app.get("/", (req, res) => {
    res.send("<h1>Backend Project Running</h1>"); 
});



// client error handling
app.use((req, res, next)=>{
    next(createError(404, "route not found"));
}); 



// General Error Handler
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message,
  }); 
});

module.exports = app;
