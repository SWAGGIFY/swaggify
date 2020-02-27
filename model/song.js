const mongoose = require ('mongoose');
const bcrypt  = require ('bcryptjs');

const SongSchema = mongoose.Schema({
    artist_id:{
        type:String
      },
    song_title:{
        type:String
      },
    song_video_url:{
        type:String
      },
    date_released:{
        type:String
      },
    
}, { timestamps: true });

const Song = module.exports = mongoose.model('Song', SongSchema);
//Create new song
module.exports.createSong = (newSong, callback)=>{
    newSong.save(callback);
  
}