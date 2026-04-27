const app = require('./config/app');
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Tanàna Madio backend running'));

app.listen(port, () => console.log(`Server listening on port ${port}`));
