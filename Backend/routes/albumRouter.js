const express = require('express');
const Album = require('../models/album');
const authenticate = require('../authenticate');
const mongoose = require('mongoose');
const cors = require('./cors');
const bodeParser = require('body-parser');

const albumRouter = express.Router();

albumRouter.use(bodeParser.json());

albumRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => {return res.statusCode(200)})
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Album.findOne({user: req.user._id})
    .populate('user')
    .then((album) => {
      if (album == null) {
        Album.create({
          user: req.user._id,
          photos: [],
          noOfImages: 0
        }).then((album) => {
          album.save()
          .then((album) => {
            Album.findById(album._id)
            .then((album) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(album);
            })
          }, (err) => next(err))
        }, (err) => next(err))
        .catch((err) => next(err))
      }
      else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(album);
      }
    }, (err) => next(err))
    .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Album.findOne({user: req.user._id})
    .then((album) => {
      if (album != null) {
        album.photos.push(req.body.photo);
        album.noOfImages = req.body.noOfImages;
        album.save()
        .then((album) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(album.noOfImages);
        }, (err) => next(err))
        .catch((err) => next(err))
      } else {
        Album.create({
          user: req.user._id,
          photos: [],
          noOfImages: req.body.noOfImages
        }).then((album) => {
          album.photos.push(req.body.photo);
          album.save()
          .then((album) => {
            Album.findById(album._id)
            .then((album) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(album.noOfImages);
            })
          }, (err) => next(err))
        }, (err) => next(err))
        .catch((err) => next(err))
      }
    }, (err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported!');
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Album.deleteOne({user: req.user._id})
    .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err))
  });

  module.exports = albumRouter;