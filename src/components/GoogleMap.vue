<template>
  <div>
    <h2>Search and add a pin</h2>
    <label>
      <gmap-autocomplete
        @place_changed="setPlace">
      </gmap-autocomplete>
      <button @click="placeMarker">Add</button>
    </label>
    <br/>

    <gmap-map
      :center="center"
      :zoom="12"
      style="width:100%;  height: 400px;" 
    >
      <gmap-info-window 
        :options="infoOptions"
        :position="infoWindowPos"
        :opened="infoWinOpen" @closeclick="!infoWinOpen"
      >
        {{ infoContent }}
      </gmap-info-window>
    
      <gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :title="infoTitle"
        :icon="m.type.icon"
        :position="m.position"
        :clickable="true"
        @click="toggleInfoWindow(m,index)"
        @dragend="m.position = {lng: $event.latLng.lng(), lat: $event.latLng.lat()}"
      ></gmap-marker>
    </gmap-map>
  </div>
</template>
<script>
//<gmap-marker.... @click="center=m.position"  >
import {gmapApi} from 'vue2-google-maps';

var oxford = {lat: 51.7520, lng: -1.2577};
    
export default {
  computed: {
    google: gmapApi
  },
  watch: {
  },
  components: {
  },
  name: "GoogleMap",
  data() {
    return {
      // default to montreal to keep it simple
      // change this to whatever makes sense
     
      // This is the start location
      center: oxford,

      infoContent: '',
      infoTitle: '',
      infoWindowPos: null,
      infoWinOpen: false,
      
      currentMidx: null,
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35
        }
      },
      newMarker: null,
      markers: [],
      places: [],
      currentPlace: null
    };
  },

  mounted() {
    // Run this 'on-startup'
    console.log("Calling geolocate...")
    this.geolocate();
    
    console.log("Calling populate markers...")
    this.getMarkers();
    
    this.toast('Map Loaded!')

  },

  methods: {
    toast(message){
      this.$toasted.success(message);
    },
    /*
     * Add a marker to the localStorage, and save it.
     */
    addMarker() {
      console.log("Adding marker...");
      // ensure data exists/typed...
      if( ! this.newMarker) {
        return;
      }

      this.markers.push(this.newMarker);
      this.newMarker = '';
      this.saveMarkers();
    },

    /*
     * Save the local storage and markers 
     */
    saveMarkers() {
      console.log("Saving markers to storage...");
      const parsed = JSON.stringify(this.markers);
      localStorage.setItem('markers', parsed);
    },


    /*
     * Read all the markers from local storage
     */
    getMarkers (){
      console.log("Running getting markers...")
      if (localStorage.getItem('markers')) {
        console.log("storage found markers")
          try {
            this.markers = JSON.parse(localStorage.getItem('markers'));
            console.log(this.markers)
            this.center = this.markers[0].position
          } catch(e) {
            localStorage.removeItem('markers');
          }
      }
      console.log("These are the markers: " + this.markers);
    },

    /*
     * Display the infow window on top of the marker
     */
    toggleInfoWindow: function(marker, idx) {
      this.infoWindowPos = marker.position;
      this.infoContent = marker.infoText;
      this.infoTitle = marker.infoTitle;
      //check if its the same marker that was selected if yes toggle
      if (this.currentMidx === idx) {
        this.infoWinOpen = !this.infoWinOpen;
      }
     //if different marker set infowindow to open and reset current marker index
     else {
       this.infoWinOpen = true;
       this.currentMidx = idx;
     }
    },
    
    /*
     * Set the place ising the autocomplete input field
     */
    setPlace(place) {
      this.currentPlace = place;
    },

    placeMarker() {
      if( this.currentPlace ) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng()
        }
      this.markers.push({ position: marker, infoTitle: 'new marker', type: {icon: 'https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png'} });
      this.saveMarkers();
      this.places.push( this.currentPlace );
      this.center = marker;
      this.currentPlace = null;

      }

    },

    geolocate: function() {
      console.log("Running geolocate function");
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      });
    }
  }
};
</script>
