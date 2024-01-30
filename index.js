// index.js
const express = require('express');
const sequelize = require('./config/database');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const Service = require('./model/service');
const SECRET_KEY = 'your_secret_key_here';
const Category = require("./model/category");

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
  

  app.post('/category', authenticateToken, async(req, res) => {
    const { name } = req.body;

    try {
      
      const newCategory = await Category.create({ name });
  
      res.json(newCategory);
    } catch (error) {
      console.error('Error creating category:', error);
      res.sendStatus(500);
    }
  })
  app.get('/categories', authenticateToken, async (req, res) => {
    try {
      
      const categories = await Category.findAll({
        include: Service, 
      });
  
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.sendStatus(500);
    }
  });
  app.put('/category/:categoryId', authenticateToken, async (req, res) => {
    const categoryId = parseInt(req.params.categoryId);
    const { name } = req.body;
  
    try {
      
      const category = await Category.findByPk(categoryId);
  
      if (category) {
        
        category.name = name;
  
      
        await category.save();
  
        res.json(category);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.error('Error updating category:', error);
      res.sendStatus(500);
    }
  });
  app.delete('/category/:categoryId', authenticateToken, async (req, res) => {
    const categoryId = parseInt(req.params.categoryId);
  
    try {
      
      const category = await Category.findByPk(categoryId);
  
      if (category) {
        
        const servicesCount = await Service.count({ where: { categoryId } });
        if (servicesCount === 0) {
          
          await category.destroy();
          res.json(category);
        } else {
          res.status(400).json({ error: 'Category has associated services and cannot be deleted' });
        }
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      res.sendStatus(500);
    }
  });
  app.post('/category/:categoryId/service', authenticateToken, async (req, res) => {
    const categoryId = parseInt(req.params.categoryId);
    const { name, type, priceOptions } = req.body;
  
    try {
    
      const category = await Category.findByPk(categoryId);
  
      if (category) {
        
        const newService = await Service.create({ categoryId, name, type, priceOptions });
  
        
        category.services.push(newService.id);
        await category.save();
  
        res.json(newService);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.error('Error creating service:', error);
      res.sendStatus(500);
    }
  });
  
app.get('/category/:categoryId/services', authenticateToken, async (req, res) => {
  const categoryId = parseInt(req.params.categoryId);

  try {
    const category = await Category.findByPk(categoryId, {
      include: Service, 
    });

    if (category) {
      
      const categoryServices = category.services;
      res.json(categoryServices);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Error fetching category services:', error);
    res.sendStatus(500);
  }
});
  app.delete('/service/:ServiceID', async (req, res) => {
    try {
      const ServiceID = req.params.ServiceID;
      const service = await Service.findByPk(ServiceID);
  
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
  
