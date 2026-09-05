import "dotenv/config";

import app from "./app.js";


const PORT =
  Number(process.env.PORT) || 3000;


app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(`http://localhost:${PORT}`);
    console.log(`  http://localhost:${PORT}/health`);
    console.log(
      ` ${process.env.NODE_ENV || "development"}`
    );
  }
);