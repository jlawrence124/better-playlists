import React, { Component } from 'react';
import './App.css';

let defaultStyle = {
  color: '#fff'
};

//pseudo data used for testing
let fakeServerData = {
  user: {
    name: 'Josh',
    playlists: [
      {
        name: 'My Favorites',
        songs: [{name:'Beat It', duration: 1345},
          {name:'Thriller', duration: 1322},
          {name:'Dirty Diana', duration: 1445},
          {name:'Black or White', duration: 1885}]
      },
      {
        name: 'Discover Weekly',
        songs: [{name:'I Cannot Feel My Face', duration: 1500},
                {name:'Beyond the Sea', duration: 1280},
                {name:'Boy Problems', duration: 1325}]
      },
      {
        name: 'Gaming Playlist',
        songs: [{name:'Legend Has It', duration: 1322},
                {name:'I Am Legend', duration: 1285},
                {name:'Legendary Song Name', duration: 1265}]
      },
      {
        name: 'The LAST Playlist',
        songs: [{name:'Last Dance', duration: 1166},
                {name:'Last Week', duration: 1565},
                {name:'Last Laugh', duration: 1229}]
      }
    ]
  }
};

//playlist component
class PlaylistCounter extends Component {
  render() {
    return (
      //...method extends the defaultStyle attribute specified above
      <div style={{...defaultStyle, width: '40%', display: 'inline-block'}}>
        <h2>{this.props.playlists.length} playlists</h2>
      </div>
    );
  }
}

// component contains the total hours
class HoursCounter extends Component {
  render() {
    // takes separate songs from ajax data and creates a new array full of all songs
    let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
      return songs.concat(eachPlaylist.songs)
    } ,[])
    // sums allSongs durations
    let totalDuration = allSongs.reduce((sum, eachSong) => {
      return sum + eachSong.duration
    }, 0)
    return (
      //returns totalDuration in hours
      <div style={{...defaultStyle, width: '40%', display: 'inline-block'}}>
        <h2>{Math.round(totalDuration/60)} hours</h2>
      </div>
    );
  }
}

//this component filters playlists via user search query
class Filter extends Component {
  render () {
    return (
      <div style={{defaultStyle}}>
        <img alt='test'/>
        {/* when typing, take the text input and bind it to the onTextChange method */}
        <input type='text' onKeyUp={(event) => this.props.onTextChange(event.target.value)}/>
      </div>
    );
  }
}

//component displaying the playlists
class Playlist extends Component {
  render () {

    let playlist = this.props.playlist;

    return (
      <div style={{...defaultStyle, display: 'inline-block', width: "25%"}}>
        <img alt='test'/>
        <h3>{playlist.name}</h3>
        <ul>
            {/* map songs within playlist to an unordered list */}
            {playlist.songs.map(song =>
                <li key={song.name}>{song.name}</li>
            )}
        </ul>
      </div>
    );
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = {
      // initiate serverData object to be used by components
      serverData: {},
      filterString: ''
    }
  }
  //on load of page
  componentDidMount() {
    //fake AJAX request using setTimeout to emulate server request
    setTimeout( () => {
      this.setState({serverData: fakeServerData});
    }, 1000);
  }
  render() {
    let playlistToRender =
      // if serverData user exits
      this.state.serverData.user ?

      // filter playlists
      this.state.serverData.user.playlists.filter(playlist => 

      /* makes search queries case insensitive by reducing playlist names
      and filter queries toLowerCase */
        playlist.name.toLowerCase().includes(
          this.state.filterString.toLowerCase())
      ) : []

    return (
      <div className="App">

        {/* ternary operator used to specify that this.state.serverData.user exists */}
        {this.state.serverData.user ?

          <div>
            <h1 style= {{...defaultStyle, 'fontSize': '54px'}}>
            {this.state.serverData.user.name}'s Playlists
            </h1>

          {/* sets props for PlaylistCounter component */}
          <PlaylistCounter playlists={playlistToRender}/>

          {/* sets props for HoursCounter component */}
          <HoursCounter playlists={playlistToRender}/>

          {/* when text changes in the filter component, change the state of the filterString object */}
          <Filter onTextChange={text => this.setState({filterString: text})}/>

          {/* maps all playlists based on user input */}
          {playlistToRender.map((playlist) =>
              <Playlist key={playlist.name} playlist={playlist} />
          )}
          </div>

          // if this.state.serverData.user does not yet exist, show loading... text
          : <h1 style={defaultStyle}>Loading...</h1>
      }
      </div>
    );
  }
}

export default App;
