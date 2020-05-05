var introModel = require('../models/intro.model.js');


module.exports = {

  list: function (req, res) {
    console.log('In list!');
    console.log(req);
    introModel.find(function (err, intros) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting intro.',
          error: err
        });
      }
      return res.json(intros);
    });
  },

  show: function (req, res) {
    var id = req.params.id;
    introModel.findOne({_id: id}, function (err, intro) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting intro.',
          error: err
        });
      }
      if (!intro) {
        return res.status(404).json({
          message: 'No such intro'
        });
      }
      return res.json(intro);
    });
  },

  create: function (req, res) {
    var intro = new introModel({
      introname : req.body.introname,
      firstname : req.body.firstname,
      lastname : req.body.lastname,
      email : req.body.email,
      created : req.body.created,
      password : req.body.password,
      active : req.body.active

    });

    intro.save(function (err, intro) {
      if (err) {
        return res.status(500).json({
          message: 'Error when creating intro',
          error: err
        });
      }
      return res.status(201).json(intro);
    });
  },

  update: function (req, res) {
    var id = req.params.id;
    introModel.findOne({_id: id}, function (err, intro) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting intro',
          error: err
        });
      }
      if (!intro) {
        return res.status(404).json({
          message: 'No such intro'
        });
      }

      intro.introname = req.body.introname ? req.body.introname : intro.introname;
      intro.firstname = req.body.firstname ? req.body.firstname : intro.firstname;
      intro.lastname = req.body.lastname ? req.body.lastname : intro.lastname;
      intro.email = req.body.email ? req.body.email : intro.email;
      intro.created = req.body.created ? req.body.created : intro.created;
      intro.password = req.body.password ? req.body.password : intro.password;
      intro.active = req.body.active ? req.body.active : intro.active;

      intro.save(function (err, intro) {
        if (err) {
          return res.status(500).json({
            message: 'Error when updating intro.',
            error: err
          });
        }

        return res.json(intro);
      });
    });
  },

  remove: function (req, res) {
    var id = req.params.id;
    introModel.findByIdAndRemove(id, function (err, intro) {
      if (err) {
        return res.status(500).json({
          message: 'Error when deleting the intro.',
          error: err
        });
      }
      return res.status(204).json();
    });
  }
};
