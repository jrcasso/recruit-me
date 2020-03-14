var motdModel = require('../models/motd.model.js');

/**
 * motdController.js
 *
 * @description :: Server-side logic for managing motds.
 */
module.exports = {

    /**
     * motdController.list()
     */
    list: function (req, res) {
        motdModel.find(function (err, motds) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting motd.',
                    error: err
                });
            }
            return res.json(motds);
        });
    },

    /**
     * motdController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        motdModel.findOne({_id: id}, function (err, motd) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting motd.',
                    error: err
                });
            }
            if (!motd) {
                return res.status(404).json({
                    message: 'No such motd'
                });
            }
            return res.json(motd);
        });
    },

    /**
     * motdController.create()
     */
    create: function (req, res) {
        var motd = new motdModel({
            message : req.body.message,
            foreground : req.body.foreground,
            background : req.body.background,
            timestamp : req.body.timestamp

        });

        motd.save(function (err, motd) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating motd',
                    error: err
                });
            }
            return res.status(201).json(motd);
        });
    },

    /**
     * motdController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        motdModel.findOne({_id: id}, function (err, motd) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting motd',
                    error: err
                });
            }
            if (!motd) {
                return res.status(404).json({
                    message: 'No such motd'
                });
            }

            motd.message = req.body.message ? req.body.message : motd.message;
            motd.foreground = req.body.foreground ? req.body.foreground : motd.foreground;
            motd.background = req.body.background ? req.body.background : motd.background;
            motd.timestamp = req.body.timestamp ? req.body.timestamp : motd.timestamp;
            
            motd.save(function (err, motd) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating motd.',
                        error: err
                    });
                }

                return res.json(motd);
            });
        });
    },

    /**
     * motdController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        motdModel.findByIdAndRemove(id, function (err, motd) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the motd.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
