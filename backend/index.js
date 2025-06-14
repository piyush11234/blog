const express = require('express');
require('dotenv').config();
const cors = require('cors');
const db_connect = require('./database/db.js');
const router = require('./routes/user.routes.js');
const blogRouter = require('./routes/blog.routes.js');
const commentRouter = require('./routes/comment.routes.js');
const cookieParser = require('cookie-parser');
const path = require('path') 

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
// ✅ Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));


const _dirname=path.resolve()

// ✅ Routes
app.use('/api/user', router);
app.use('/api/blog', blogRouter);
app.use('/api/comment', commentRouter);


app.use(express.static(path.join(_dirname,"/frontend/dist")));
//  app.get("*", (_, res)=>{
//     res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"))
//  });

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  db_connect();
  console.log(`Server is running on port ${PORT}`);
});
