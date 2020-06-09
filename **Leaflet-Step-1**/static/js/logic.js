  var data = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

  
  // Adding a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map

  
  var greymap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: API_KEY
    });

    var myMap = L.map("map", {
        center: [40.6527, -74.259],
        zoom: 3
      });
      greymap.addTo(myMap);

      d3.json(data,function(earthqdata){
         function styleinfo(feature) {
             return {
            radius: getradius(feature.properties.mag),
            fillColor: getcolor(feature.properties.mag),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
         }
         function getradius(magnitude){
             return magnitude * 4;
         }
         function getcolor(magcolor){
             switch(true){
                 case magcolor >5:
                     return "red";
                 case magcolor >4:
                     return "blue";
                 case magcolor >3:
                     return "orange";
                 case magcolor >2:
                     return "purple";
                 default:
                     return "white";
                  }
         }
        L.geoJSON(earthqdata, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng);
            },
            style:styleinfo,
            onEachFeature: function(feature,layer){
                layer.bindPopup("Magnitude"+feature.properties.mag+"<br>location"+feature.properties.place);
            }
        }).addTo(myMap);
         var legend = L.control({position: 'bottomright'});

         legend.onAdd = function (map) {
        
            var div = L.DomUtil.create('div', 'info legend'),
                 grades = [0,1,2,3,4,5],
                

             // loop through our density intervals and generate a label with a colored square for each interval
            for (var i = 0; i < grades.length; i++) {
                 div.innerHTML +=
                     '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                     grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
             }
        
             return div;
         };
        
         legend.addTo(map);    
      })


      