const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
//models
const Song= require('../../model/song');

router.get('/artist-dashboard', ensureAuthentication, (req, res) =>{
    
    res.render('./artist/artist-dashboard',{
        layout:'./layouts/artistLayout.handlebars'
    });
});

router.get('/artist-profile', ensureAuthentication, (req, res) =>{
    
    res.render('./artist/artist-dashboard',{
        layout:'./layouts/artistLayout.handlebars'
    });
});

//customer Request
router.post('/artist-add-song',ensureAuthentication,(req, res)=>{
    
    const newSong = new Song({

        artist_id : req.user.id,
        song_title : req.body.songtitle.toLowerCase(),
        song_video_url : req.body.videourl,
        date_released: req.body.date
    });
    const errors = validationResult(req);
    Song.findOne({song_title:req.body.songtitle.toLowerCase()},(err, song)=>{
        if (err) throw err;
        Song.find({artist_id:req.user.id},(err,songs)=>{
            if(err) throw err;
            if(!song){
                Song.createSong(newSong,(err)=>{
                    if (err) throw err;
                    const alert = "alert alert-success";
                    const msg = "Successfully added";
                    res.render('./artist/artist-view-songs',{
                        layout:"./layouts/artistLayout.handlebars",
                        alert:alert,
                        msg: msg,
                        song:songs
                    });
                });
            }else{
                res.render('./artist/artist-view-songs',{
                    layout:"./layouts/artistLayout.handlebars",
                    alert:"alert alert-danger",
                    msg: "Song already added",
                    song:songs
                });
            }
        });
    });
});

// artist view songs
router.get('/artist-view-song',ensureAuthentication, (req, res)=>{
    //res.send(req.user)
    Song.find({artist_id: req.user.id},(err, song)=>{
      //var user = [users];
      if(err) throw err;
        //res.send(users);
      res.render('./artist/artist-view-songs.handlebars',{
        song:song,
        layout:"./layouts/artistLayout.handlebars"
      });
    });
  });
//check authentication
function ensureAuthentication(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect('/');
    }
}

module.exports = router;