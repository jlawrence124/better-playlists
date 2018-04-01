import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string';

let defaultStyle = {
  color: '#fff'
};

//pseudo data used for testing
// let fakeServerData = {
//   user: {
//     name: 'Josh',
//     playlists: [
//       // {
//       //   name: 'My Favorites',
//       //   songs: [{name:'Beat It', duration: 1345},
//       //     {name:'Thriller', duration: 1322},
//       //     {name:'Dirty Diana', duration: 1445},
//       //     {name:'Black or White', duration: 1885}]
//       // },
//       // {
//       //   name: 'Discover Weekly',
//       //   songs: [{name:'I Cannot Feel My Face', duration: 1500},
//       //           {name:'Beyond the Sea', duration: 1280},
//       //           {name:'Boy Problems', duration: 1325}]
//       // },
//       // {
//       //   name: 'Gaming Playlist',
//       //   songs: [{name:'Legend Has It', duration: 1322},
//       //           {name:'I Am Legend', duration: 1285},
//       //           {name:'Legendary Song Name', duration: 1265}]
//       // },
//       // {
//       //   name: 'The LAST Playlist',
//       //   songs: [{name:'Last Dance', duration: 1166},
//       //           {name:'Last Week', duration: 1565},
//       //           {name:'Last Laugh', duration: 1229}]
//       // }
//     ]
//   }
// };

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
        <img alt='playlist album' src={playlist.imageUrl} style={{width: '60px'}} />
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
    //parse accessToken from URL into usable data
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;

    //use as a replacement for html/xml/ajax request
    //takes two arguments,
    fetch('https://api.spotify.com/v1/me', {
      headers: {'Authorization': 'Bearer ' + accessToken}
      //parse response as json data
    }).then(response => response.json())
    //setState of server data from response
    .then(data => this.setState({
      user: {
        name: data.display_name
      }
    }))


    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {'Authorization': 'Bearer ' + accessToken}
      //parse response as json data
    }).then(response => response.json())

    //setState of server data from response
    .then(data => this.setState({
        playlists: data.items.map(item => {
            return {
              name: item.name,
              imageUrl: item.images[0].url,
              songs: []
            }
        })
    }))
  }

  render() {
    let playlistToRender =
      // if serverData user exists and user has playlists
      this.state.user &&
      this.state.playlists
      ?
      // filter playlists
      this.state.playlists.filter(playlist =>

      /* makes search queries case insensitive by reducing playlist names
        and filter queries toLowerCase */
        playlist.name.toLowerCase().includes(
          this.state.filterString.toLowerCase())
      )

      //if serverData user does not exist, return an empty array
      : []

    return (
      <div className="App">

        {/* ternary operator used to specify that if this.state.user exists */}
        {this.state.user ?

          <div key='componentWrapper'>
            <h1 style= {{...defaultStyle, 'fontSize': '54px'}}>
            {this.state.user.name}'s Playlists
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

          // if this.state.user does not yet exist, show loading... text
          : <button onClick={() => window.location='http://localhost:8888/login'}
            style={{padding: '20px', 'fontSize': '50px', 'marginTop': '20px'}}>Sign in with Spotify</button>
      }
      </div>
    );
  }
}

export default App;
