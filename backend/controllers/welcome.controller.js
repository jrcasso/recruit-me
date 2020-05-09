const welcomeModel = require('../models/welcome.model.js');
const mongoose = require( 'mongoose' );
const { validationResult } = require('express-validator');

/**
 * welcomeController.js
 *
 * @description :: Server-side logic for managing welcomes.
 */
module.exports = {

  list: function (req, res) {
    welcomeModel.find(function (err, welcomes) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting welcome.',
          error: err
        });
      }
      return res.json(welcomes);
    });
  },

  show: function (req, res) {
    var id = req.params.id;
    if (mongoose.Types.ObjectId.isValid(id)) {
      welcomeModel.findOne({_id: id}, function (err, welcome) {
        if (err) {
          return res.status(500).json({
            message: 'Error when getting welcome.',
            error: err
          });
        }
        if (!welcome) {
          return res.status(404).json({
            message: 'No such welcome'
          });
        }
        return res.json(welcome);
      });
    } else {
      return res.status(400).json({
        message: 'Bad Request: malformed ObjectId'
      });
    }
  },

  create: function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    var welcome = new welcomeModel({
      professional: req.body.professional ? req.body.professional : null,
      topics: req.body.topics,
    });

    welcome.save(function (err, welcome) {
      if (err) {
        return res.status(500).json({
          message: 'Error when creating welcome',
          error: err
        });
      }
      return res.status(201).json(welcome);
    });
  },

  update: function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    var id = req.params.id;
    if (mongoose.Types.ObjectId.isValid(id)) {
      welcomeModel.findOne({_id: id}, function (err, welcome) {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Error when getting welcome',
            error: err
          });
        }
        if (!welcome) {
          return res.status(404).json({
            message: 'No such welcome'
          });
        }

        welcome.professional = req.body.professional ? req.body.professional : welcome.professional;
        welcome.topics = req.body.topics ? req.body.topics : welcome.topics;

        welcome.save(function (err, welcome) {
          if (err) {
            return res.status(500).json({
              message: 'Error when updating welcome.',
              error: err
            });
          }

          return res.json(welcome);
        });
      });
    } else {
      return res.status(400).json({
        message: 'Bad Request: malformed ObjectId'
      });
    }
  },

  remove: function (req, res) {
    var id = req.params.id;
    if (mongoose.Types.ObjectId.isValid(id)) {
      welcomeModel.findByIdAndRemove(id, function (err, welcome) {
        if (err) {
          return res.status(500).json({
            message: 'Error when deleting the welcome.',
            error: err
          });
        }
        return res.status(204).json();
      });
    } else {
      return res.status(400).json({
        message: 'Bad Request: malformed ObjectId'
      });
    }
  }
};
