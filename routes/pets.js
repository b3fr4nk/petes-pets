// MODELS
const Pet = require('../models/pet');

// PET ROUTES
module.exports = (app) => {
  // INDEX PET => index.js

  // NEW PET
  app.get('/pets/new', (req, res) => {
    res.render('pets-new');
  });

  // CREATE PET
  app.post('/pets', (req, res) => {
    const pet = new Pet(req.body);

    pet.save()
        .then((pet) => {
          res.redirect(`/pets/${pet._id}`);
        })
        .catch((err) => {
        // STATUS OF 400 FOR VALIDATIONS
          res.status(400).send(err.errors);
        });
  });

  // SHOW PET
  app.get('/pets/:id', (req, res) => {
    Pet.findById(req.params.id).exec((err, pet) => {
      res.render('pets-show', {pet: pet});
    });
  });

  // EDIT PET
  app.get('/pets/:id/edit', (req, res) => {
    Pet.findById(req.params.id).exec((err, pet) => {
      res.render('pets-edit', {pet: pet});
    });
  });

  // UPDATE PET
  app.put('/pets/:id', (req, res) => {
    Pet.findByIdAndUpdate(req.params.id, req.body)
        .then((pet) => {
          res.redirect(`/pets/${pet._id}`);
        })
        .catch((err) => {
        // Handle Errors
        });
  });

  // DELETE PET
  app.delete('/pets/:id', (req, res) => {
    Pet.findByIdAndRemove(req.params.id).exec((err, pet) => {
      return res.redirect('/');
    });
  });

  // SEARCH PET
  app.get('/search', (req, res) => {
    Pet.find(
        {$text: {$search: req.query.term}},
        {score: {$meta: 'textScore'}},
    )
        .sort({score: {$meta: 'textScore'}})
        .limit(20)
        .exec(function(err, pets) {
          if (err) {
            return res.status(400).send(err);
          }
          if (req.header('Content-Type') == 'application/json') {
            return res.json({pets: pets});
          } else {
            return res.render('pets-index', {pets: pets, term: req.query.term});
          }
        });
  });

  // PURCHASE PET
  app.post('/pets/:id/purchase', (req, res) => {
    console.log(req.body);

    const stripe = require('stripe')(process.env.PRIVATE_STRIPE_API_KEY);
    // Token is created using Checkout or Elements!
    // Get the payment token ID submitted by the form:
    const token = req.body.stripeToken; // Using Express
    // req.body.petId can become null through seeding,
    // this way we'll insure we use a non-null value
    const petId = req.body.petId || req.params.id;
    Pet.findById(petId).exec((err, pet)=> {
      if (err) {
        console.log('Error: ' + err);
        res.redirect(`/pets/${req.params.id}`);
      }
      // eslint-disable-next-line no-unused-vars
      const charge = stripe.charges.create({
        amount: pet.price * 100,
        currency: 'usd',
        description: `Purchased ${pet.name}, ${pet.species}`,
        source: token,
      }).then((chg) => {
        res.redirect(`/pets/${req.params.id}`);
      })
          .catch((err) => {
            console.log('Error:' + err);
          });
    });
  });
};
