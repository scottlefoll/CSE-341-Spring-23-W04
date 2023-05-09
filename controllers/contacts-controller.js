const { MongoClient } = require('mongodb');
require('dotenv').config();
const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
const coll = process.env.DB_COLLECTION;


// GET /db ***
async function getDBList(req, res) {
    console.log('getDBList called');
    console.log('uri:', uri);
    try {
      const pool = await connect();
      const client = await pool.acquire();
      const result = await client.db().admin().listDatabases();
      client.release();
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
        client.release();
    }
  }

    // GET /contacts ***
async function getContacts(req, res) {
    console.log('getContacts called');
    console.log('uri:', uri);
    try {
      const pool = await connect();
      const client = await pool.acquire();
      const result = await client.db(dbName).collection(coll).find().toArray();
      client.release();
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
        client.release();
    }
}

    // GET /contacts/:id  ('jane_doe') ***
  async function getContactById(res, req, id) {
    console.log('getContactById called');
    console.log('uri:', uri);
    // const id = nameOfContact.toString().indexOf(' ') > 0 ? nameOfContact.toString().split(' ').join('_') : nameOfContact.toString();
    try {
      const pool = await connect();
      const client = await pool.acquire();
      const result = await client.db(dbName).collection(coll).findOne({ _id: id });
      client.release();
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
        client.release();
    }
  }

// GET /contacts/name/:name (ie. 'jane doe' or 'jane_doe') ***
async function getContactsByName(req, res, nameOfContact) {
    console.log('getContactsByName called');
    console.log('uri:', uri)
    const [firstName, lastName] = nameOfContact.replace('_', ' ').split(' ').map(s => s.replace(/^\w/, c => c.toUpperCase())); // Split full name into first name and last name, and convert each to initial uppercase
    try {
        const pool = await connect();
        const client = await pool.acquire();
        const result = await client.db(dbName).collection(coll).findOne({
            firstName: { $regex: `^${firstName}$`, $options: 'i' },
            lastName: { $regex: `^${lastName}$`, $options: 'i' }
          });
        client.release();
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        client.release();
    }
    }

    // GET /contacts/lname/:name ***
async function getContactsByLName(res, req, nameOfContact) {
    console.log('getContactsByLName called');
    console.log('uri:', uri);
    try {
      const pool = await connect();
      const client = await pool.acquire();
      const result = await client.db(dbName).collection(coll).find({ lastName: { $regex: `^${nameOfContact}$`, $options: 'i' } }).sort({ firstName: 1 }).find().toArray();
      client.release();
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
        client.release();
    }
  }

    // GET /contacts/fname/:name ***
async function getContactsByFName(res, req, nameOfContact) {
        console.log('getContactsByFName called');
        console.log('uri:', uri);
    try {
        const pool = await connect();
        const client = await pool.acquire();
        const result = await client.db(dbName).collection(coll).find({ firstName: { $regex: `^${nameOfContact}$`, $options: 'i' } }).sort({ lastName: 1 }).find().toArray();
        client.release();
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        client.release();
    }
}


// POST /contacts/create  ***
async function createContact(req, res) {
    console.log('createContact called');
    console.log('uri:', uri);
    let { _id, firstName, lastName, email, favoriteColor, birthday } = req.body;

    // if _id is not provided, concatenate first and last name and replace spaces with underscores
    // to create a unique ID
    if (!_id) {
        // _id = `${firstName}_${lastName}`.replace(/\s/g, '_');
        _id = `${firstName}_${lastName}`.replace(/\s/g, '_').toLowerCase();
    }
    const newContact = {
        _id,
        firstName,
        lastName,
        email,
        favoriteColor,
        birthday: new Date(birthday),
    };
    try {
        const pool = await connect();
        const client = await pool.acquire();
        const result = await client.db(dbName).collection(coll).insertOne(newContact);
        res.status(201).send({ _id: result.insertedId });
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        client.release();
    }
}

    //  POST /contacts/update/:id
//   async function updateContact(req, res) {
    // if the firstName or lastName fields are updated, then the _id should be updated.
    // in order to update the _id, we need to delete the existing contact and create a new one,
    // since _id is immutable

//     console.log('updateContact called');
//     console.log('uri:', uri);
//     const client = new MongoClient(uri);
//     try {
//       await client.connect();
//       const contactId = req.params.id; // get the ID of the contact to update from the request parameters
//       // Dynamically build the updatedContact object based on the fields present in the request body
//       const updateFields = {};
//       for (const [key, value] of Object.entries(req.body)) {
//         updateFields[key] = value;
//       }
//       const updatedContact = { $set: updateFields };
//       const result = await client
//         .db(dbName)
//         .collection(coll)
//         .updateOne({ _id: contactId }, updatedContact); // use updateOne() to update the contact with the specified ID
//       res.send({ message: `Contact ${contactId} updated successfully` });
//     //   if the update contained the firstName and/or the lastName fields, then the _id must be updated
//         if (updateFields.firstName || updateFields.lastName) {
//             await changeContactId(contactId);
//         }
//     } catch (err) {
//       console.error(err);
//       throw err;
//     } finally {
//       await client.close();
//     }
//   }

// PUT /contacts/update/:id ***
async function updateContact(req, res) {
        // if the firstName or lastName fields are updated, then the _id should be updated.
        // in order to update the _id, we need to delete the existing contact and create a new one,
        // since _id is immutable
        console.log('updateContact called');
        console.log('uri:', uri);
        const contactId = req.params.id; // get the ID of the contact to update from the request parameters
        // Dynamically build the updatedContact object based on the fields present in the request body
        const updateFields = {};
        for (const [key, value] of Object.entries(req.body)) {
        updateFields[key] = value;
        }
        const updatedContact = { $set: updateFields };
        const options = { returnOriginal: false }; // set the returnOriginal option to false to return the updated document
    try {
        const pool = await connect();
        const client = await pool.acquire();
        const result = await client
            .db(dbName)
            .collection(coll)
            .findOneAndUpdate({ _id: contactId }, updatedContact, options); // use findOneAndUpdate() to update the contact with the specified ID
        //   if the update contained the firstName and/or the lastName fields, then the _id must be updated
        if (updateFields.firstName || updateFields.lastName) {
            await changeContactId(contactId);
        }
        res.send({ message: `Contact ${contactId} updated successfully`, updatedContact: result.value });
        client.release();
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        client.release();
    }
}


//  This function is for the internal use of the updateContact() function ***
//  It creates a new _id if the firstName or lastName fields are changed
async function changeContactId(_id) {
    console.log('changeContactId called');
    console.log('uri:', uri);
    try {
        const pool = await connect();
        const client = await pool.acquire();
        // find the old contact record by the _id parameter
        const oldContact = await client.db(dbName).collection(coll).findOne({ _id });
        // create a new contact object with the updated _id based on the firstName and lastName fields
        const newContact = {
            _id: `${oldContact.firstName.toLowerCase().replace(' ', '_')}_${oldContact.lastName.toLowerCase().replace(' ', '_')}`,
            firstName: oldContact.firstName,
            lastName: oldContact.lastName,
            email: oldContact.email,
            favoriteColor: oldContact.favoriteColor,
            birthday: oldContact.birthday,
        };
        // insert the new contact object into the database
        const result = await client.db(dbName).collection(coll).insertOne(newContact);
        //   if the insert was successful, delete the old contact record
        if (result.insertedId) {
            await client.db(dbName).collection(coll).deleteOne({ _id });
            // if the old contact record was successfully deleted, return the new contact record
            client.release();
            return { message: `New contact ${result.insertedId} created successfully` };
        }
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        client.release();
    }
}

// DELETE /contacts/delete/:id ***
async function deleteContact(req, res) {
    console.log('deleteContact called');
    console.log('uri:', uri);
    const contactId = req.params.id; // get the ID of the contact to delete from the request parameters
    try {
        const pool = await connect();
        const client = await pool.acquire();
        const result = await client.db(dbName).collection(coll).deleteOne({ _id: contactId }); // use deleteOne() method to delete the contact with the specified ID
        res.send({ message: `Contact ${contactId} deleted successfully` });
        client.release();
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        client.release();
    }
}


  module.exports = {
    getDBList,
    getContacts,
    getContactsByName,
    getContactsByLName,
    getContactsByFName,
    getContactById,
    updateContact,
    deleteContact,
    createContact,
  };

  console.log('contacts-controller.js is loaded!');



//   reformatted versions of the CRUD functions using Mongoose:
//   async function getDBList(req, res) {
//     console.log('getDBList called');
//     console.log('uri:', uri);
  
//     try {
//       const result = await mongoose.connection.db.admin().listDatabases();
//       return result;
//     } catch (err) {
//       console.error(err);
//       throw err;
//     }
//   }
  
//   async function getContacts(req, res) {
//     console.log('getContacts called');
//     console.log('uri:', uri);
  
//     try {
//       const result = await Contact.find({});
//       return result;
//     } catch (err) {
//       console.error(err);
//       throw err;
//     }
//   }
  
//   async function getContactById(nameOfContact, res, req) {
//     console.log('getContactById called');
//     console.log('uri:', uri);
  
//     try {
//       const id = nameOfContact.toString().indexOf(' ') > 0 ? nameOfContact.toString().split(' ').join('_') : nameOfContact.toString();
//       const result = await Contact.findOne({ _id: id });
//       return result;
//     } catch (err) {
//       console.error(err);
//       throw err;
//     }
//   }
  
//   async function getContactsByLName(nameOfContact, res, req) {
//     console.log('getContactsByLName called');
//     console.log('uri:', uri);
  
//     try {
//       const result = await Contact.find({ lastName: { $regex: `^${nameOfContact}$`, $options: 'i' } }).sort({ firstName: 1 });
//       return result;
//     } catch (err) {
//       console.error(err);
//       throw err;
//     }
//   }
  
//   async function getContactsByFName(nameOfContact, res, req) {
//     console.log('getContactsByFName called');
//     console.log('uri:', uri);
  
//     try {
//       const result = await Contact.find({ firstName: { $regex: `^${nameOfContact}$`, $options: 'i' } }).sort({ lastName: 1 });
//       return result;
//     } catch (err) {
//       console.error(err);
//       throw err;
//     }
//   }
  
//   async function createContact(req, res) {
//     console.log('createContact called');
//     console.log('uri:', uri);
  
//     try {
//       let { _id, firstName, lastName, email, favoriteColor, birthday } = req.body;
  
//       if (!_id) {
//         _id = `${firstName}_${lastName}`.replace(/\s/g, '_').toLowerCase();
//       }
  
//       const newContact = new Contact({
//         _id,
//         firstName,
//         lastName,
//         email,
//         favoriteColor,
//         birthday: new Date(birthday),
//       });
  
//       await newContact.save();
//       res.status(201).send({ _id: newContact._id });
//     } catch (err) {
//       console.error(err);
//       throw err;
//     }
//   }
  
//   async function updateContact(req, res) {
//     console.log('updateContact called');
//     console.log('uri:', uri);
  
//     try {
//       const contactId = req.params.id;
//       const updateFields = {};
//       for (const [key, value] of Object.entries(req.body)) {
//         updateFields[key] = value;
//       }
//       const updatedContact = { $set: updateFields };
//       await Contact.updateOne({ _id: contactId }, updatedContact);
  
//       if (updateFields.firstName || updateFields.lastName) {
//         await changeContactId(contactId);
//       }
  
//       res.send({ message: `Contact ${contactId} updated successfully` });
//     } catch (err) {
//       console.error(err);
//       throw err;
//     }
//   }

//   async function changeContactId(_id) {
//     console.log('changeContactId called');
//     console.log('uri:', uri);
//     try {
//       const oldContact = await Contact.findById(_id);
//       const newContact = {
//         _id: `${oldContact.firstName.toLowerCase().replace(' ', '_')}_${oldContact.lastName.toLowerCase().replace(' ', '_')}`,
//         firstName: oldContact.firstName,
//         lastName: oldContact.lastName,
//         email: oldContact.email,
//         favoriteColor: oldContact.favoriteColor,
//         birthday: oldContact.birthday,
//       };
//       const createdContact = await Contact.create(newContact);
//       await Contact.findByIdAndDelete(_id);
//       return { message: `New contact ${createdContact._id} created successfully` };
//     } catch (err) {
//       console.error(err);
//       throw err;
//     }
//   }
  
  
//   async function deleteContact(req, res) {
//     console.log('deleteContact called');
//     console.log('uri:', uri);
//     try {
//       const { id } = req.params;
//       await Contact.findByIdAndDelete(id);
//       res.send({ message: `Contact ${id} deleted successfully` });
//     } catch (err) {
//       console.error(err);
//       throw err;
//     }
//   }
  