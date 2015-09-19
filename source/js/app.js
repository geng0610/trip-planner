
L.mapbox.accessToken = 'pk.eyJ1IjoiZ2VuZzA2MTAiLCJhIjoiM2E5YWIzMDU0YmQxZGVhMTI0NWFkZGI5NTk2Njk2ODkifQ.batYlvCbe9tWYG8Sc_OTZw';
var map = L.mapbox.map('map', 'mapbox.streets').setView([40.718243, -73.99868], 14);
var myLayer = L.mapbox.featureLayer().addTo(map);
var markers = [];
var currentMarker;

var venueData;
var currentDay;
function Day(){
	this.currentDay = false;
	this.Hotels = [];
	this.Restaurants = [];
	this.Activities = [];
}

Day.prototype.makeCurrent = function(){
	this.currentDay = true;
}

Day.prototype.nonCurrent = function(){
	this.currentDay = false;
}

Day.prototype.add = function(typeName,venueId){
	for(var i =0; i<this[typeName].length; i++){
		if (this[typeName][i]._id==venueId){
			return false
		}
	}
	this[typeName].push(venueLookup(venueData[typeName].content,venueId))
}

Day.prototype.delete = function(typeName,venueId){
	var venues = this[typeName];
	var newVenues = [];
	for (var i =0; i<venues.length; i++){
		if(venues[i]._id!=venueId){
			newVenues.push(venues[i])
		}
	}
	this[typeName]=newVenues;
}

function Itinerary(){
	this.days = [];
}

Itinerary.prototype.add = function(){
	var newDay = new Day();
	if(currentDay){
		currentDay.nonCurrent();
	}
	newDay.makeCurrent();
	this.days.push(newDay);
	currentDay = newDay;
}

Itinerary.prototype.delete = function(){
	var Days = this.days;
	for (var i =0; i<Days.length; i++){
		if (Days[i].currentDay){
			console.log(currentDay);
			if(Days.length>1){
				Days.splice(i, 1);
				currentDay = Days[Math.max(0,i-1)];
				currentDay.makeCurrent();
			} else {
				alert("You are removing the only day left in your vacation!");
			}
			break;
		}
	}
}

Itinerary.prototype.select = function(index){
	currentDay.nonCurrent();
	this.days[index].makeCurrent();
	currentDay=this.days[index];
}

var $itinerarySelectorHTML = $('<button class="day-selector itinerary-selector SUI_SECONDARY_BUTTON" index></button>');
var $itineraryContentContentHTML = $('<div class="itinerary-content-content SUI_HIDE"></div>');
var $ContentSectionHTML = $('<div class="content-section" venueType></div>');
var $ContentSectionHeaderHTML = $('<div class="content-section-header"><div class="SUI_VA_TEXTWRAPPER"><div class="SUI_VAMIDDLE_TEXTWRAPPER_INNERTEXT"></div></div></div>');
var $ContentSectionBodyHTML = $('<div class="content-section-body" venueId><div class="SUI_VA_TEXTWRAPPER"><div class="SUI_VAMIDDLE_TEXTWRAPPER_INNERTEXT"></div></div></div>');
var $ContentSectionTextHTML = $('<div class="content-section-text"><div class="SUI_VA_TEXTWRAPPER"><div class="SUI_VAMIDDLE_TEXTWRAPPER_INNERTEXT"></div></div></div>');
var $ContentSectionDeletebutton = $('<div class="content-section-deletebutton"><div class="SUI_VA_TEXTWRAPPER"><div class="SUI_VAMIDDLE_TEXTWRAPPER_INNERTEXT icon-rte-delete"></div></div></div>')




function addDayHTML($dayHTML, day, venueType, venueTitleText){
	var $newContentSectionHTML = $ContentSectionHTML.clone();
	$newContentSectionHTML.attr('venueType', venueType);
	var $newContentSectionHeaderHTML = $ContentSectionHeaderHTML.clone();
	$newContentSectionHeaderHTML.find('.SUI_VAMIDDLE_TEXTWRAPPER_INNERTEXT').text(venueTitleText);
	$newContentSectionHTML.append($newContentSectionHeaderHTML);
	if(day[venueType].length==0){
		var $newContentSectionBodyHTML = $ContentSectionBodyHTML.clone();
		var $newContentSectionTextHTML = $ContentSectionTextHTML.clone();
		$newContentSectionTextHTML.find('.SUI_VAMIDDLE_TEXTWRAPPER_INNERTEXT').addClass('shady-text');
		$newContentSectionTextHTML.find('.SUI_VAMIDDLE_TEXTWRAPPER_INNERTEXT').text('Select from above');
		$newContentSectionBodyHTML.append($newContentSectionTextHTML);
		$newContentSectionHTML.append($newContentSectionBodyHTML);
	} else {
		for (var j = 0; j<day[venueType].length;j++){
			var $newContentSectionBodyHTML = $ContentSectionBodyHTML.clone();
			$newContentSectionBodyHTML.attr('venueId', day[venueType][j]._id);
			var $newContentSectionTextHTML = $ContentSectionTextHTML.clone();
			$newContentSectionTextHTML.find('.SUI_VAMIDDLE_TEXTWRAPPER_INNERTEXT').text(day[venueType][j].name);
			var $newContentSectionDeletebutton = $ContentSectionDeletebutton.clone();
			$newContentSectionBodyHTML.append($newContentSectionTextHTML);
			$newContentSectionBodyHTML.append($newContentSectionDeletebutton);
			$newContentSectionHTML.append($newContentSectionBodyHTML);
		}
	}
	$dayHTML.append($newContentSectionHTML);
}

Itinerary.prototype.render=function(){
	console.log('rendering');
	$('.itinerary-content-content').remove();
	$('.day-selector').remove();
	for (var i = 0; i<this.days.length; i++){
		var thisDay = this.days[i];
		var $newItinerarySelectorHTML = $itinerarySelectorHTML.clone();
		$newItinerarySelectorHTML.attr('index', i);
		$newItinerarySelectorHTML.text(i+1);
		var $newDayHTML = $itineraryContentContentHTML.clone();
		if(thisDay.currentDay){
			$newDayHTML.removeClass('SUI_HIDE');
			$newItinerarySelectorHTML.removeClass('SUI_SECONDARY_BUTTON');
			$newItinerarySelectorHTML.addClass('SUI_PRIMARY_BUTTON');
		}
		$('#itinerary-content').find('.itinerary-header').find('.SUI_VAMIDDLE_TEXTWRAPPER_INNERTEXT').append($newItinerarySelectorHTML);
		addDayHTML($newDayHTML, thisDay, 'Hotels', 'My Hotel');
		addDayHTML($newDayHTML, thisDay, 'Restaurants', 'My Restaurants');
		addDayHTML($newDayHTML, thisDay, 'Activities', 'My Activities');
		$('#itinerary-content').append($newDayHTML);
	}


	markers = [];

	for (var element in venueData){
		var venues = venueData[element].content;
		var venueType = venueData[element].type;
		for(var i=0; i<venues.length;i++){
			var venue = venues[i];
			var markerState = false;

			// console.log(venue._id, currentMarkerId);
			if(venue._id == currentMarkerId){
				markerState = 'mouseSelected';
			}
			for (var j = 0; j<this.days.length; j++){
				var thisDay = this.days[j];
				for (var k = 0; k<thisDay[venueType].length; k++){
					if(venue._id == thisDay[venueType][k]._id){
						if(thisDay.currentDay){
							markerState = 'currentSelected';
						} else {
							markerState = 'noncurrentSelected';
						}
					}
				}
			}
			currentMarker = Marker(markerState,venue,venueType)
			markers.push(currentMarker);
		}
	}
	myLayer.setGeoJSON(markers);
}

var myItinerary = new Itinerary();

var currentMarkerId = null;

function Marker(state, venue, venueType){
	return{
			id: venue._id,
		    type: 'Feature',
		    geometry: {
		        type: 'Point',
		        coordinates: 
		        [
		          venue.place[0].location[1],
		          venue.place[0].location[0]
		        ]
		    },
		    properties: {
		        title: venue.name,
		        description: venue.description||'<div class = "SUI_PRIMARY_BUTTON">description placeholder</div>',
		        'marker-size': 'large',
		        'marker-color': (state=='currentSelected')?(venueType == 'Hotels')?'#6DD8BB':(venueType == 'Restaurants')?'#5252CA':'#FFC76F'
		        :(state=='noncurrentSelected')?(venueType == 'Hotels')?'#E2F7F1':(venueType == 'Restaurants')?'#DCDCF4':'#FFF4E2'
		        :(state=='mouseSelected')?(venueType == 'Hotels')?'#A7E8D6':(venueType == 'Restaurants')?'#9797DF':'#FFDDA9'
		        :'#BDBDBD',
		        'marker-symbol': (venueType == 'Hotels')?'lodging':(venueType == 'Restaurants')?'restaurant':'star-stroked'
		    }
		}
}

(function($){
	$(document).ready(function(){
		$.ajax({
			method: "GET",
			url: "/api/venues"
		}).done(function(data){
			venueData = data;
			myItinerary.render();
		});
	});
}(jQuery));


function addDay(day){
	$.ajax({
		method: "POST",
		url: "/api/newDay/"+day
	}).done(function(data){
		console.log(data);
	});
}


function displayDay(dayId){
	$.ajax({
		method: "GET",
		url: "/api/getDay/"+dayId
	}).done(function(data){
		console.log(data);
	});
}


function deleteDay(dayId){
	$.ajax({
		method: "DELETE",
		url: "/api/deleteDay/"+dayId
	}).done(function(data){
		console.log(data);
	});
}


function addToDay(dayId,venue, venueId){
	$.ajax({
		method: "POST",
		url: "/api/addtoDay/"+dayId+"/"+venue+"/"+venueId
	}).done(function(data){
		console.log(data);
	});
}


function updateDay(dayId,venue, venueIds){
	console.log(JSON.stringify(venueIds));
	$.ajax({
		method: "POST",
		url: "/api/addtoDay/"+dayId+"/"+venue+"/",
		data:JSON.stringify(venueIds),
		contentType:"application/json"
	}).done(function(data){
		console.log(data);
	});
}



function venueLookup(venues, id){
	for(var i=0; i<venues.length; i++){
		if(venues[i]._id==id){
			return venues[i];
		}
	}
}

$("body").on("click", ".venue-add", function(e){
    var $this = $(this);
    var venueContent = $this.closest('.venue-content');
    var type = $this.closest('.venue-content').attr('venueType');
    var selectedVenueDiv = venueContent.find('.SELECTED_DROPDOWN_OPTION');
    var id = selectedVenueDiv.attr('venueId');
    if(id){
	    currentDay.add(type,id);
		myItinerary.render();
    }
});

$("body").on("click", ".content-section-deletebutton", function(e){
    var $this = $(this);
    var $contentSection = $this.closest('.content-section');
    var type = $contentSection.attr('venueType');
    var id = $this.closest('.content-section-body').attr('venueId');
    currentDay.delete(type,id);
	myItinerary.render();
});

$("body").on("click", "#day-adder", function(e){
	myItinerary.add();
	myItinerary.render();
});

$("body").on("click", ".day-selector", function(e){
    var $this = $(this);
    var index = $this.attr('index');
    myItinerary.select(index);
	myItinerary.render();
});

$("body").on("click", ".itinerary-footer-deletebutton", function(e){
	myItinerary.delete();
	myItinerary.render();
});

myLayer.on('click', function(e) {
	var markerId = e.layer.feature.id;
	currentMarkerId = markerId;
	for(var i = 0; i<$('.SUI_OPTIONS_DROPDOWN_OPTION').length;i++){
		if($('.SUI_OPTIONS_DROPDOWN_OPTION')[i]){
			var venueOption = $($('.SUI_OPTIONS_DROPDOWN_OPTION')[i]);
			if(venueOption.attr('venueId')==markerId){
				venueOption.click();
				break;
			}
		}
	}
	// myItinerary.render();

});


$(document).ready(function(){
	$('#day-adder').click();
})











