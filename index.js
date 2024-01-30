// index.js
const express = require('express');
const sequelize = require('./config/database');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { codeForTommorow } = require('./model/codeForTommorow');
//const services =require("./model/services");
const services = require('./model/services');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.json());



sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
function generateToken() {
    return jwt.sign({}, SECRET_KEY, { expiresIn: '1h' });
  }
  

  function authenticateToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) return res.sendStatus(401);
  
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  }
  (async () => {
    try {
      await sequelize.authenticate();
      console.log('Connection to the database has been established successfully.');
      await sequelize.sync(); 
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  })();
  
  
  app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (email === 'admin@codesfortomorrow.com' && password === 'Admin123!@#') {
      const token = generateToken();
      res.json({ token });
    } else {
      res.sendStatus(401);
    }
  });
  

  app.post('/category', authenticateToken, (req, res) => {
    const { name } = req.body;
    const newCategory = { id: categories.length + 1, name, services: [] };
    categories.push(newCategory);
    res.json(newCategory);
  });
  app.get('/categories', authenticateToken, (req, res) => {
    res.json(categories);
  });
  app.put('/category/:categoryId', authenticateToken, (req, res) => {
    const categoryId = parseInt(req.params.categoryId);
    const { name } = req.body;
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      category.name = name;
      res.json(category);
    } else {
      res.sendStatus(404);
    }
  });
  app.delete('/category/:categoryId', authenticateToken, (req, res) => {
    const categoryId = parseInt(req.params.categoryId);
    const index = categories.findIndex((c) => c.id === categoryId && c.services.length === 0);
    if (index !== -1) {
      const deletedCategory = categories.splice(index, 1)[0];
      res.json(deletedCategory);
    } else {
      res.sendStatus(404);
    }
  });
  app.post('/category/:categoryId/service', authenticateToken, (req, res) => {
    const categoryId = parseInt(req.params.categoryId);
    const { name, type, priceOptions } = req.body;
  
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      const newService = { id: services.length + 1, categoryId, name, type, priceOptions };
      services.push(newService);
      category.services.push(newService.id);
      res.json(newService);
    } else {
      res.sendStatus(404);
    }
  });
  app.get('/category/:categoryId/services', authenticateToken, (req, res) => {
    const categoryId = parseInt(req.params.categoryId);
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      const categoryServices = services.filter((s) => s.categoryId === categoryId);
      res.json(categoryServices);
    } else {
      res.sendStatus(404);
    }
  });
  app.delete('/service/:ServiceID', async (req, res) => {
    try {
      const ServiceID = req.params.ServiceID;
      const service = await Student.findByPk(ServiceID);
  
      if (!service) {
        return res.status(404).json({ error: 'Student not found' });
      }
  
      await service.destroy();
      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  app.put('/category/:categoryId/service/:serviceId', authenticateToken, async (req, res) => {
    const categoryId = parseInt(req.params.categoryId);
    const serviceId = parseInt(req.params.serviceId);
    const { name, type, priceOptions } = req.body;
  
    try {
      
      const category = await Category.findByPk(categoryId);
      const service = await Service.findByPk(serviceId);
  
      if (!category || !service) {
        return res.sendStatus(404);
      }
  
      
      service.name = name;
      service.type = type;
  
    
      await service.save();
  
      res.json(service);
    } catch (error) {
      console.error('Error updating service:', error);
      res.sendStatus(500);
    }
  });
  
