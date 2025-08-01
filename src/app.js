require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const apiRoutes = require('./routes/user.routes');
const port = process.env.PORT || 8080;

app.use(cors()); //Cho phép tất cả nguồn gọi API
app.use(express.json()); // for json
app.use(express.urlencoded({ extended: true })); // for form data

//khai báo route
app.use('/v1/api', apiRoutes);

app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});
