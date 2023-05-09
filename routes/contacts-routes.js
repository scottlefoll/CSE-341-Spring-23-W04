const routes = require('express').Router();
const contactsController = require('../controllers/contacts-controller');


routes.get('/', (req, res) => {
    res.send('Welcome to my MongoDB Contacts API! Please enter a valid endpoint to continue (all parameters are case-insensitive): (/db (List of databases), /contacts (List of all contacts), /contacts/:id (Full name search, i.e. - jane_doe ), /contacts/lastname/:lname, /contacts/firstname/:fname');
  });

  routes.get('/api-docs', async (req, res, next) => {
    try {
      const collection = await contactsController.getDBList();
      res.send(collection);
    } catch (err) {
      next(err);
    }
  });

routes.get('/db', async (req, res, next) => {
    try {
      const collection = await contactsController.getDBList();
      res.send(collection);
    } catch (err) {
      next(err);
    }
  });


routes.get('/contacts', async (req, res, next) => {
    try {
      const collection = await contactsController.getContacts();
      res.send(collection);
    } catch (err) {
      next(err);
    }
  });


routes.get('/contacts/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const collection = await contactsController.getContactById(id);
      res.send(collection);
    } catch (err) {
      next(err);
    }
  });

  routes.get('/contacts/name/:name', async (req, res, next) => {
    try {
      const { name } = req.params;
      const collection = await contactsController.getContactsByLName(name);
      res.send(collection);
    } catch (err) {
      next(err);
    }
  });

routes.get('/contacts/lastname/:lname', async (req, res, next) => {
  try {
    const { lname } = req.params;
    const collection = await contactsController.getContactsByLName(lname);
    res.send(collection);
  } catch (err) {
    next(err);
  }
});


routes.get('/contacts/firstname/:fname', async (req, res, next) => {
    try {
      const { fname } = req.params;
      const collection = await contactsController.getContactsByFName(fname);
      res.send(collection);
    } catch (err) {
      next(err);
    }
  });


routes.post('/contacts/create', async (req, res, next) => {
    try {
      await contactsController.createContact(req, res);
    } catch (err) {
      next(err);
    }
});

routes.put('/contacts/update/:id', async (req, res, next) => {
    try {
      await contactsController.updateContact(req, res);
    } catch (err) {
      next(err);
    }
  });

// routes.post('/contacts/update/:id', async (req, res, next) => {
//     try {
//       await contactsController.updateContact(req, res);
//     } catch (err) {
//       next(err);
//     }
//   });


  routes.delete('/contacts/delete/:id', async (req, res, next) => {
    try {
      await contactsController.deleteContact(req, res);
    } catch (err) {
      next(err);
    }
  });

module.exports = routes;