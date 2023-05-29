/* eslint-disable max-len */
const Pet = require('../models/pet');

module.exports = (app) => {
  /* GET home page. */
  app.get('/', (req, res) => {
    const page = req.query.page || 1;
    Pet.paginate({}, {page: page}).then((results) => {
      if (req.header('Content-Type') == 'application/json') {
        return res.json({pets: results.docs, pagesCount: results.pages, currentPage: page});
      // Otherwise we do what we did before
      } else {
        res.render('pets-index', {pets: results.docs, pagesCount: results.pages, currentPage: page});
      }
    });
  });
};
