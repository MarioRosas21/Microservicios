const express = require('express');
const app = express();
const ineRoutes = require('./rutas/ine');

app.use(express.json());            
app.use('/api', ineRoutes);          

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
