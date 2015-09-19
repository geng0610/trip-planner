
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












//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiXG5MLm1hcGJveC5hY2Nlc3NUb2tlbiA9ICdway5leUoxSWpvaVoyVnVaekEyTVRBaUxDSmhJam9pTTJFNVlXSXpNRFUwWW1ReFpHVmhNVEkwTldGa1pHSTVOVGsyTmprMk9Ea2lmUS5iYXRZbHZDYmU5dFdZRzhTY19PVFp3JztcbnZhciBtYXAgPSBMLm1hcGJveC5tYXAoJ21hcCcsICdtYXBib3guc3RyZWV0cycpLnNldFZpZXcoWzQwLjcxODI0MywgLTczLjk5ODY4XSwgMTQpO1xudmFyIG15TGF5ZXIgPSBMLm1hcGJveC5mZWF0dXJlTGF5ZXIoKS5hZGRUbyhtYXApO1xudmFyIG1hcmtlcnMgPSBbXTtcbnZhciBjdXJyZW50TWFya2VyO1xuXG52YXIgdmVudWVEYXRhO1xudmFyIGN1cnJlbnREYXk7XG5mdW5jdGlvbiBEYXkoKXtcblx0dGhpcy5jdXJyZW50RGF5ID0gZmFsc2U7XG5cdHRoaXMuSG90ZWxzID0gW107XG5cdHRoaXMuUmVzdGF1cmFudHMgPSBbXTtcblx0dGhpcy5BY3Rpdml0aWVzID0gW107XG59XG5cbkRheS5wcm90b3R5cGUubWFrZUN1cnJlbnQgPSBmdW5jdGlvbigpe1xuXHR0aGlzLmN1cnJlbnREYXkgPSB0cnVlO1xufVxuXG5EYXkucHJvdG90eXBlLm5vbkN1cnJlbnQgPSBmdW5jdGlvbigpe1xuXHR0aGlzLmN1cnJlbnREYXkgPSBmYWxzZTtcbn1cblxuRGF5LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbih0eXBlTmFtZSx2ZW51ZUlkKXtcblx0Zm9yKHZhciBpID0wOyBpPHRoaXNbdHlwZU5hbWVdLmxlbmd0aDsgaSsrKXtcblx0XHRpZiAodGhpc1t0eXBlTmFtZV1baV0uX2lkPT12ZW51ZUlkKXtcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdH1cblx0fVxuXHR0aGlzW3R5cGVOYW1lXS5wdXNoKHZlbnVlTG9va3VwKHZlbnVlRGF0YVt0eXBlTmFtZV0uY29udGVudCx2ZW51ZUlkKSlcbn1cblxuRGF5LnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbih0eXBlTmFtZSx2ZW51ZUlkKXtcblx0dmFyIHZlbnVlcyA9IHRoaXNbdHlwZU5hbWVdO1xuXHR2YXIgbmV3VmVudWVzID0gW107XG5cdGZvciAodmFyIGkgPTA7IGk8dmVudWVzLmxlbmd0aDsgaSsrKXtcblx0XHRpZih2ZW51ZXNbaV0uX2lkIT12ZW51ZUlkKXtcblx0XHRcdG5ld1ZlbnVlcy5wdXNoKHZlbnVlc1tpXSlcblx0XHR9XG5cdH1cblx0dGhpc1t0eXBlTmFtZV09bmV3VmVudWVzO1xufVxuXG5mdW5jdGlvbiBJdGluZXJhcnkoKXtcblx0dGhpcy5kYXlzID0gW107XG59XG5cbkl0aW5lcmFyeS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oKXtcblx0dmFyIG5ld0RheSA9IG5ldyBEYXkoKTtcblx0aWYoY3VycmVudERheSl7XG5cdFx0Y3VycmVudERheS5ub25DdXJyZW50KCk7XG5cdH1cblx0bmV3RGF5Lm1ha2VDdXJyZW50KCk7XG5cdHRoaXMuZGF5cy5wdXNoKG5ld0RheSk7XG5cdGN1cnJlbnREYXkgPSBuZXdEYXk7XG59XG5cbkl0aW5lcmFyeS5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24oKXtcblx0dmFyIERheXMgPSB0aGlzLmRheXM7XG5cdGZvciAodmFyIGkgPTA7IGk8RGF5cy5sZW5ndGg7IGkrKyl7XG5cdFx0aWYgKERheXNbaV0uY3VycmVudERheSl7XG5cdFx0XHRjb25zb2xlLmxvZyhjdXJyZW50RGF5KTtcblx0XHRcdGlmKERheXMubGVuZ3RoPjEpe1xuXHRcdFx0XHREYXlzLnNwbGljZShpLCAxKTtcblx0XHRcdFx0Y3VycmVudERheSA9IERheXNbTWF0aC5tYXgoMCxpLTEpXTtcblx0XHRcdFx0Y3VycmVudERheS5tYWtlQ3VycmVudCgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YWxlcnQoXCJZb3UgYXJlIHJlbW92aW5nIHRoZSBvbmx5IGRheSBsZWZ0IGluIHlvdXIgdmFjYXRpb24hXCIpO1xuXHRcdFx0fVxuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG59XG5cbkl0aW5lcmFyeS5wcm90b3R5cGUuc2VsZWN0ID0gZnVuY3Rpb24oaW5kZXgpe1xuXHRjdXJyZW50RGF5Lm5vbkN1cnJlbnQoKTtcblx0dGhpcy5kYXlzW2luZGV4XS5tYWtlQ3VycmVudCgpO1xuXHRjdXJyZW50RGF5PXRoaXMuZGF5c1tpbmRleF07XG59XG5cbnZhciAkaXRpbmVyYXJ5U2VsZWN0b3JIVE1MID0gJCgnPGJ1dHRvbiBjbGFzcz1cImRheS1zZWxlY3RvciBpdGluZXJhcnktc2VsZWN0b3IgU1VJX1NFQ09OREFSWV9CVVRUT05cIiBpbmRleD48L2J1dHRvbj4nKTtcbnZhciAkaXRpbmVyYXJ5Q29udGVudENvbnRlbnRIVE1MID0gJCgnPGRpdiBjbGFzcz1cIml0aW5lcmFyeS1jb250ZW50LWNvbnRlbnQgU1VJX0hJREVcIj48L2Rpdj4nKTtcbnZhciAkQ29udGVudFNlY3Rpb25IVE1MID0gJCgnPGRpdiBjbGFzcz1cImNvbnRlbnQtc2VjdGlvblwiIHZlbnVlVHlwZT48L2Rpdj4nKTtcbnZhciAkQ29udGVudFNlY3Rpb25IZWFkZXJIVE1MID0gJCgnPGRpdiBjbGFzcz1cImNvbnRlbnQtc2VjdGlvbi1oZWFkZXJcIj48ZGl2IGNsYXNzPVwiU1VJX1ZBX1RFWFRXUkFQUEVSXCI+PGRpdiBjbGFzcz1cIlNVSV9WQU1JRERMRV9URVhUV1JBUFBFUl9JTk5FUlRFWFRcIj48L2Rpdj48L2Rpdj48L2Rpdj4nKTtcbnZhciAkQ29udGVudFNlY3Rpb25Cb2R5SFRNTCA9ICQoJzxkaXYgY2xhc3M9XCJjb250ZW50LXNlY3Rpb24tYm9keVwiIHZlbnVlSWQ+PGRpdiBjbGFzcz1cIlNVSV9WQV9URVhUV1JBUFBFUlwiPjxkaXYgY2xhc3M9XCJTVUlfVkFNSURETEVfVEVYVFdSQVBQRVJfSU5ORVJURVhUXCI+PC9kaXY+PC9kaXY+PC9kaXY+Jyk7XG52YXIgJENvbnRlbnRTZWN0aW9uVGV4dEhUTUwgPSAkKCc8ZGl2IGNsYXNzPVwiY29udGVudC1zZWN0aW9uLXRleHRcIj48ZGl2IGNsYXNzPVwiU1VJX1ZBX1RFWFRXUkFQUEVSXCI+PGRpdiBjbGFzcz1cIlNVSV9WQU1JRERMRV9URVhUV1JBUFBFUl9JTk5FUlRFWFRcIj48L2Rpdj48L2Rpdj48L2Rpdj4nKTtcbnZhciAkQ29udGVudFNlY3Rpb25EZWxldGVidXR0b24gPSAkKCc8ZGl2IGNsYXNzPVwiY29udGVudC1zZWN0aW9uLWRlbGV0ZWJ1dHRvblwiPjxkaXYgY2xhc3M9XCJTVUlfVkFfVEVYVFdSQVBQRVJcIj48ZGl2IGNsYXNzPVwiU1VJX1ZBTUlERExFX1RFWFRXUkFQUEVSX0lOTkVSVEVYVCBpY29uLXJ0ZS1kZWxldGVcIj48L2Rpdj48L2Rpdj48L2Rpdj4nKVxuXG5cblxuXG5mdW5jdGlvbiBhZGREYXlIVE1MKCRkYXlIVE1MLCBkYXksIHZlbnVlVHlwZSwgdmVudWVUaXRsZVRleHQpe1xuXHR2YXIgJG5ld0NvbnRlbnRTZWN0aW9uSFRNTCA9ICRDb250ZW50U2VjdGlvbkhUTUwuY2xvbmUoKTtcblx0JG5ld0NvbnRlbnRTZWN0aW9uSFRNTC5hdHRyKCd2ZW51ZVR5cGUnLCB2ZW51ZVR5cGUpO1xuXHR2YXIgJG5ld0NvbnRlbnRTZWN0aW9uSGVhZGVySFRNTCA9ICRDb250ZW50U2VjdGlvbkhlYWRlckhUTUwuY2xvbmUoKTtcblx0JG5ld0NvbnRlbnRTZWN0aW9uSGVhZGVySFRNTC5maW5kKCcuU1VJX1ZBTUlERExFX1RFWFRXUkFQUEVSX0lOTkVSVEVYVCcpLnRleHQodmVudWVUaXRsZVRleHQpO1xuXHQkbmV3Q29udGVudFNlY3Rpb25IVE1MLmFwcGVuZCgkbmV3Q29udGVudFNlY3Rpb25IZWFkZXJIVE1MKTtcblx0aWYoZGF5W3ZlbnVlVHlwZV0ubGVuZ3RoPT0wKXtcblx0XHR2YXIgJG5ld0NvbnRlbnRTZWN0aW9uQm9keUhUTUwgPSAkQ29udGVudFNlY3Rpb25Cb2R5SFRNTC5jbG9uZSgpO1xuXHRcdHZhciAkbmV3Q29udGVudFNlY3Rpb25UZXh0SFRNTCA9ICRDb250ZW50U2VjdGlvblRleHRIVE1MLmNsb25lKCk7XG5cdFx0JG5ld0NvbnRlbnRTZWN0aW9uVGV4dEhUTUwuZmluZCgnLlNVSV9WQU1JRERMRV9URVhUV1JBUFBFUl9JTk5FUlRFWFQnKS5hZGRDbGFzcygnc2hhZHktdGV4dCcpO1xuXHRcdCRuZXdDb250ZW50U2VjdGlvblRleHRIVE1MLmZpbmQoJy5TVUlfVkFNSURETEVfVEVYVFdSQVBQRVJfSU5ORVJURVhUJykudGV4dCgnU2VsZWN0IGZyb20gYWJvdmUnKTtcblx0XHQkbmV3Q29udGVudFNlY3Rpb25Cb2R5SFRNTC5hcHBlbmQoJG5ld0NvbnRlbnRTZWN0aW9uVGV4dEhUTUwpO1xuXHRcdCRuZXdDb250ZW50U2VjdGlvbkhUTUwuYXBwZW5kKCRuZXdDb250ZW50U2VjdGlvbkJvZHlIVE1MKTtcblx0fSBlbHNlIHtcblx0XHRmb3IgKHZhciBqID0gMDsgajxkYXlbdmVudWVUeXBlXS5sZW5ndGg7aisrKXtcblx0XHRcdHZhciAkbmV3Q29udGVudFNlY3Rpb25Cb2R5SFRNTCA9ICRDb250ZW50U2VjdGlvbkJvZHlIVE1MLmNsb25lKCk7XG5cdFx0XHQkbmV3Q29udGVudFNlY3Rpb25Cb2R5SFRNTC5hdHRyKCd2ZW51ZUlkJywgZGF5W3ZlbnVlVHlwZV1bal0uX2lkKTtcblx0XHRcdHZhciAkbmV3Q29udGVudFNlY3Rpb25UZXh0SFRNTCA9ICRDb250ZW50U2VjdGlvblRleHRIVE1MLmNsb25lKCk7XG5cdFx0XHQkbmV3Q29udGVudFNlY3Rpb25UZXh0SFRNTC5maW5kKCcuU1VJX1ZBTUlERExFX1RFWFRXUkFQUEVSX0lOTkVSVEVYVCcpLnRleHQoZGF5W3ZlbnVlVHlwZV1bal0ubmFtZSk7XG5cdFx0XHR2YXIgJG5ld0NvbnRlbnRTZWN0aW9uRGVsZXRlYnV0dG9uID0gJENvbnRlbnRTZWN0aW9uRGVsZXRlYnV0dG9uLmNsb25lKCk7XG5cdFx0XHQkbmV3Q29udGVudFNlY3Rpb25Cb2R5SFRNTC5hcHBlbmQoJG5ld0NvbnRlbnRTZWN0aW9uVGV4dEhUTUwpO1xuXHRcdFx0JG5ld0NvbnRlbnRTZWN0aW9uQm9keUhUTUwuYXBwZW5kKCRuZXdDb250ZW50U2VjdGlvbkRlbGV0ZWJ1dHRvbik7XG5cdFx0XHQkbmV3Q29udGVudFNlY3Rpb25IVE1MLmFwcGVuZCgkbmV3Q29udGVudFNlY3Rpb25Cb2R5SFRNTCk7XG5cdFx0fVxuXHR9XG5cdCRkYXlIVE1MLmFwcGVuZCgkbmV3Q29udGVudFNlY3Rpb25IVE1MKTtcbn1cblxuSXRpbmVyYXJ5LnByb3RvdHlwZS5yZW5kZXI9ZnVuY3Rpb24oKXtcblx0Y29uc29sZS5sb2coJ3JlbmRlcmluZycpO1xuXHQkKCcuaXRpbmVyYXJ5LWNvbnRlbnQtY29udGVudCcpLnJlbW92ZSgpO1xuXHQkKCcuZGF5LXNlbGVjdG9yJykucmVtb3ZlKCk7XG5cdGZvciAodmFyIGkgPSAwOyBpPHRoaXMuZGF5cy5sZW5ndGg7IGkrKyl7XG5cdFx0dmFyIHRoaXNEYXkgPSB0aGlzLmRheXNbaV07XG5cdFx0dmFyICRuZXdJdGluZXJhcnlTZWxlY3RvckhUTUwgPSAkaXRpbmVyYXJ5U2VsZWN0b3JIVE1MLmNsb25lKCk7XG5cdFx0JG5ld0l0aW5lcmFyeVNlbGVjdG9ySFRNTC5hdHRyKCdpbmRleCcsIGkpO1xuXHRcdCRuZXdJdGluZXJhcnlTZWxlY3RvckhUTUwudGV4dChpKzEpO1xuXHRcdHZhciAkbmV3RGF5SFRNTCA9ICRpdGluZXJhcnlDb250ZW50Q29udGVudEhUTUwuY2xvbmUoKTtcblx0XHRpZih0aGlzRGF5LmN1cnJlbnREYXkpe1xuXHRcdFx0JG5ld0RheUhUTUwucmVtb3ZlQ2xhc3MoJ1NVSV9ISURFJyk7XG5cdFx0XHQkbmV3SXRpbmVyYXJ5U2VsZWN0b3JIVE1MLnJlbW92ZUNsYXNzKCdTVUlfU0VDT05EQVJZX0JVVFRPTicpO1xuXHRcdFx0JG5ld0l0aW5lcmFyeVNlbGVjdG9ySFRNTC5hZGRDbGFzcygnU1VJX1BSSU1BUllfQlVUVE9OJyk7XG5cdFx0fVxuXHRcdCQoJyNpdGluZXJhcnktY29udGVudCcpLmZpbmQoJy5pdGluZXJhcnktaGVhZGVyJykuZmluZCgnLlNVSV9WQU1JRERMRV9URVhUV1JBUFBFUl9JTk5FUlRFWFQnKS5hcHBlbmQoJG5ld0l0aW5lcmFyeVNlbGVjdG9ySFRNTCk7XG5cdFx0YWRkRGF5SFRNTCgkbmV3RGF5SFRNTCwgdGhpc0RheSwgJ0hvdGVscycsICdNeSBIb3RlbCcpO1xuXHRcdGFkZERheUhUTUwoJG5ld0RheUhUTUwsIHRoaXNEYXksICdSZXN0YXVyYW50cycsICdNeSBSZXN0YXVyYW50cycpO1xuXHRcdGFkZERheUhUTUwoJG5ld0RheUhUTUwsIHRoaXNEYXksICdBY3Rpdml0aWVzJywgJ015IEFjdGl2aXRpZXMnKTtcblx0XHQkKCcjaXRpbmVyYXJ5LWNvbnRlbnQnKS5hcHBlbmQoJG5ld0RheUhUTUwpO1xuXHR9XG5cblxuXHRtYXJrZXJzID0gW107XG5cblx0Zm9yICh2YXIgZWxlbWVudCBpbiB2ZW51ZURhdGEpe1xuXHRcdHZhciB2ZW51ZXMgPSB2ZW51ZURhdGFbZWxlbWVudF0uY29udGVudDtcblx0XHR2YXIgdmVudWVUeXBlID0gdmVudWVEYXRhW2VsZW1lbnRdLnR5cGU7XG5cdFx0Zm9yKHZhciBpPTA7IGk8dmVudWVzLmxlbmd0aDtpKyspe1xuXHRcdFx0dmFyIHZlbnVlID0gdmVudWVzW2ldO1xuXHRcdFx0dmFyIG1hcmtlclN0YXRlID0gZmFsc2U7XG5cblx0XHRcdC8vIGNvbnNvbGUubG9nKHZlbnVlLl9pZCwgY3VycmVudE1hcmtlcklkKTtcblx0XHRcdGlmKHZlbnVlLl9pZCA9PSBjdXJyZW50TWFya2VySWQpe1xuXHRcdFx0XHRtYXJrZXJTdGF0ZSA9ICdtb3VzZVNlbGVjdGVkJztcblx0XHRcdH1cblx0XHRcdGZvciAodmFyIGogPSAwOyBqPHRoaXMuZGF5cy5sZW5ndGg7IGorKyl7XG5cdFx0XHRcdHZhciB0aGlzRGF5ID0gdGhpcy5kYXlzW2pdO1xuXHRcdFx0XHRmb3IgKHZhciBrID0gMDsgazx0aGlzRGF5W3ZlbnVlVHlwZV0ubGVuZ3RoOyBrKyspe1xuXHRcdFx0XHRcdGlmKHZlbnVlLl9pZCA9PSB0aGlzRGF5W3ZlbnVlVHlwZV1ba10uX2lkKXtcblx0XHRcdFx0XHRcdGlmKHRoaXNEYXkuY3VycmVudERheSl7XG5cdFx0XHRcdFx0XHRcdG1hcmtlclN0YXRlID0gJ2N1cnJlbnRTZWxlY3RlZCc7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRtYXJrZXJTdGF0ZSA9ICdub25jdXJyZW50U2VsZWN0ZWQnO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Y3VycmVudE1hcmtlciA9IE1hcmtlcihtYXJrZXJTdGF0ZSx2ZW51ZSx2ZW51ZVR5cGUpXG5cdFx0XHRtYXJrZXJzLnB1c2goY3VycmVudE1hcmtlcik7XG5cdFx0fVxuXHR9XG5cdG15TGF5ZXIuc2V0R2VvSlNPTihtYXJrZXJzKTtcbn1cblxudmFyIG15SXRpbmVyYXJ5ID0gbmV3IEl0aW5lcmFyeSgpO1xuXG52YXIgY3VycmVudE1hcmtlcklkID0gbnVsbDtcblxuZnVuY3Rpb24gTWFya2VyKHN0YXRlLCB2ZW51ZSwgdmVudWVUeXBlKXtcblx0cmV0dXJue1xuXHRcdFx0aWQ6IHZlbnVlLl9pZCxcblx0XHQgICAgdHlwZTogJ0ZlYXR1cmUnLFxuXHRcdCAgICBnZW9tZXRyeToge1xuXHRcdCAgICAgICAgdHlwZTogJ1BvaW50Jyxcblx0XHQgICAgICAgIGNvb3JkaW5hdGVzOiBcblx0XHQgICAgICAgIFtcblx0XHQgICAgICAgICAgdmVudWUucGxhY2VbMF0ubG9jYXRpb25bMV0sXG5cdFx0ICAgICAgICAgIHZlbnVlLnBsYWNlWzBdLmxvY2F0aW9uWzBdXG5cdFx0ICAgICAgICBdXG5cdFx0ICAgIH0sXG5cdFx0ICAgIHByb3BlcnRpZXM6IHtcblx0XHQgICAgICAgIHRpdGxlOiB2ZW51ZS5uYW1lLFxuXHRcdCAgICAgICAgZGVzY3JpcHRpb246IHZlbnVlLmRlc2NyaXB0aW9ufHwnPGRpdiBjbGFzcyA9IFwiU1VJX1BSSU1BUllfQlVUVE9OXCI+ZGVzY3JpcHRpb24gcGxhY2Vob2xkZXI8L2Rpdj4nLFxuXHRcdCAgICAgICAgJ21hcmtlci1zaXplJzogJ2xhcmdlJyxcblx0XHQgICAgICAgICdtYXJrZXItY29sb3InOiAoc3RhdGU9PSdjdXJyZW50U2VsZWN0ZWQnKT8odmVudWVUeXBlID09ICdIb3RlbHMnKT8nIzZERDhCQic6KHZlbnVlVHlwZSA9PSAnUmVzdGF1cmFudHMnKT8nIzUyNTJDQSc6JyNGRkM3NkYnXG5cdFx0ICAgICAgICA6KHN0YXRlPT0nbm9uY3VycmVudFNlbGVjdGVkJyk/KHZlbnVlVHlwZSA9PSAnSG90ZWxzJyk/JyNFMkY3RjEnOih2ZW51ZVR5cGUgPT0gJ1Jlc3RhdXJhbnRzJyk/JyNEQ0RDRjQnOicjRkZGNEUyJ1xuXHRcdCAgICAgICAgOihzdGF0ZT09J21vdXNlU2VsZWN0ZWQnKT8odmVudWVUeXBlID09ICdIb3RlbHMnKT8nI0E3RThENic6KHZlbnVlVHlwZSA9PSAnUmVzdGF1cmFudHMnKT8nIzk3OTdERic6JyNGRkREQTknXG5cdFx0ICAgICAgICA6JyNCREJEQkQnLFxuXHRcdCAgICAgICAgJ21hcmtlci1zeW1ib2wnOiAodmVudWVUeXBlID09ICdIb3RlbHMnKT8nbG9kZ2luZyc6KHZlbnVlVHlwZSA9PSAnUmVzdGF1cmFudHMnKT8ncmVzdGF1cmFudCc6J3N0YXItc3Ryb2tlZCdcblx0XHQgICAgfVxuXHRcdH1cbn1cblxuKGZ1bmN0aW9uKCQpe1xuXHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuXHRcdCQuYWpheCh7XG5cdFx0XHRtZXRob2Q6IFwiR0VUXCIsXG5cdFx0XHR1cmw6IFwiL2FwaS92ZW51ZXNcIlxuXHRcdH0pLmRvbmUoZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHR2ZW51ZURhdGEgPSBkYXRhO1xuXHRcdFx0bXlJdGluZXJhcnkucmVuZGVyKCk7XG5cdFx0fSk7XG5cdH0pO1xufShqUXVlcnkpKTtcblxuXG5mdW5jdGlvbiBhZGREYXkoZGF5KXtcblx0JC5hamF4KHtcblx0XHRtZXRob2Q6IFwiUE9TVFwiLFxuXHRcdHVybDogXCIvYXBpL25ld0RheS9cIitkYXlcblx0fSkuZG9uZShmdW5jdGlvbihkYXRhKXtcblx0XHRjb25zb2xlLmxvZyhkYXRhKTtcblx0fSk7XG59XG5cblxuZnVuY3Rpb24gZGlzcGxheURheShkYXlJZCl7XG5cdCQuYWpheCh7XG5cdFx0bWV0aG9kOiBcIkdFVFwiLFxuXHRcdHVybDogXCIvYXBpL2dldERheS9cIitkYXlJZFxuXHR9KS5kb25lKGZ1bmN0aW9uKGRhdGEpe1xuXHRcdGNvbnNvbGUubG9nKGRhdGEpO1xuXHR9KTtcbn1cblxuXG5mdW5jdGlvbiBkZWxldGVEYXkoZGF5SWQpe1xuXHQkLmFqYXgoe1xuXHRcdG1ldGhvZDogXCJERUxFVEVcIixcblx0XHR1cmw6IFwiL2FwaS9kZWxldGVEYXkvXCIrZGF5SWRcblx0fSkuZG9uZShmdW5jdGlvbihkYXRhKXtcblx0XHRjb25zb2xlLmxvZyhkYXRhKTtcblx0fSk7XG59XG5cblxuZnVuY3Rpb24gYWRkVG9EYXkoZGF5SWQsdmVudWUsIHZlbnVlSWQpe1xuXHQkLmFqYXgoe1xuXHRcdG1ldGhvZDogXCJQT1NUXCIsXG5cdFx0dXJsOiBcIi9hcGkvYWRkdG9EYXkvXCIrZGF5SWQrXCIvXCIrdmVudWUrXCIvXCIrdmVudWVJZFxuXHR9KS5kb25lKGZ1bmN0aW9uKGRhdGEpe1xuXHRcdGNvbnNvbGUubG9nKGRhdGEpO1xuXHR9KTtcbn1cblxuXG5mdW5jdGlvbiB1cGRhdGVEYXkoZGF5SWQsdmVudWUsIHZlbnVlSWRzKXtcblx0Y29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkodmVudWVJZHMpKTtcblx0JC5hamF4KHtcblx0XHRtZXRob2Q6IFwiUE9TVFwiLFxuXHRcdHVybDogXCIvYXBpL2FkZHRvRGF5L1wiK2RheUlkK1wiL1wiK3ZlbnVlK1wiL1wiLFxuXHRcdGRhdGE6SlNPTi5zdHJpbmdpZnkodmVudWVJZHMpLFxuXHRcdGNvbnRlbnRUeXBlOlwiYXBwbGljYXRpb24vanNvblwiXG5cdH0pLmRvbmUoZnVuY3Rpb24oZGF0YSl7XG5cdFx0Y29uc29sZS5sb2coZGF0YSk7XG5cdH0pO1xufVxuXG5cblxuZnVuY3Rpb24gdmVudWVMb29rdXAodmVudWVzLCBpZCl7XG5cdGZvcih2YXIgaT0wOyBpPHZlbnVlcy5sZW5ndGg7IGkrKyl7XG5cdFx0aWYodmVudWVzW2ldLl9pZD09aWQpe1xuXHRcdFx0cmV0dXJuIHZlbnVlc1tpXTtcblx0XHR9XG5cdH1cbn1cblxuJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi52ZW51ZS1hZGRcIiwgZnVuY3Rpb24oZSl7XG4gICAgdmFyICR0aGlzID0gJCh0aGlzKTtcbiAgICB2YXIgdmVudWVDb250ZW50ID0gJHRoaXMuY2xvc2VzdCgnLnZlbnVlLWNvbnRlbnQnKTtcbiAgICB2YXIgdHlwZSA9ICR0aGlzLmNsb3Nlc3QoJy52ZW51ZS1jb250ZW50JykuYXR0cigndmVudWVUeXBlJyk7XG4gICAgdmFyIHNlbGVjdGVkVmVudWVEaXYgPSB2ZW51ZUNvbnRlbnQuZmluZCgnLlNFTEVDVEVEX0RST1BET1dOX09QVElPTicpO1xuICAgIHZhciBpZCA9IHNlbGVjdGVkVmVudWVEaXYuYXR0cigndmVudWVJZCcpO1xuICAgIGlmKGlkKXtcblx0ICAgIGN1cnJlbnREYXkuYWRkKHR5cGUsaWQpO1xuXHRcdG15SXRpbmVyYXJ5LnJlbmRlcigpO1xuICAgIH1cbn0pO1xuXG4kKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIFwiLmNvbnRlbnQtc2VjdGlvbi1kZWxldGVidXR0b25cIiwgZnVuY3Rpb24oZSl7XG4gICAgdmFyICR0aGlzID0gJCh0aGlzKTtcbiAgICB2YXIgJGNvbnRlbnRTZWN0aW9uID0gJHRoaXMuY2xvc2VzdCgnLmNvbnRlbnQtc2VjdGlvbicpO1xuICAgIHZhciB0eXBlID0gJGNvbnRlbnRTZWN0aW9uLmF0dHIoJ3ZlbnVlVHlwZScpO1xuICAgIHZhciBpZCA9ICR0aGlzLmNsb3Nlc3QoJy5jb250ZW50LXNlY3Rpb24tYm9keScpLmF0dHIoJ3ZlbnVlSWQnKTtcbiAgICBjdXJyZW50RGF5LmRlbGV0ZSh0eXBlLGlkKTtcblx0bXlJdGluZXJhcnkucmVuZGVyKCk7XG59KTtcblxuJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIiNkYXktYWRkZXJcIiwgZnVuY3Rpb24oZSl7XG5cdG15SXRpbmVyYXJ5LmFkZCgpO1xuXHRteUl0aW5lcmFyeS5yZW5kZXIoKTtcbn0pO1xuXG4kKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIFwiLmRheS1zZWxlY3RvclwiLCBmdW5jdGlvbihlKXtcbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuICAgIHZhciBpbmRleCA9ICR0aGlzLmF0dHIoJ2luZGV4Jyk7XG4gICAgbXlJdGluZXJhcnkuc2VsZWN0KGluZGV4KTtcblx0bXlJdGluZXJhcnkucmVuZGVyKCk7XG59KTtcblxuJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5pdGluZXJhcnktZm9vdGVyLWRlbGV0ZWJ1dHRvblwiLCBmdW5jdGlvbihlKXtcblx0bXlJdGluZXJhcnkuZGVsZXRlKCk7XG5cdG15SXRpbmVyYXJ5LnJlbmRlcigpO1xufSk7XG5cbm15TGF5ZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXHR2YXIgbWFya2VySWQgPSBlLmxheWVyLmZlYXR1cmUuaWQ7XG5cdGN1cnJlbnRNYXJrZXJJZCA9IG1hcmtlcklkO1xuXHRmb3IodmFyIGkgPSAwOyBpPCQoJy5TVUlfT1BUSU9OU19EUk9QRE9XTl9PUFRJT04nKS5sZW5ndGg7aSsrKXtcblx0XHRpZigkKCcuU1VJX09QVElPTlNfRFJPUERPV05fT1BUSU9OJylbaV0pe1xuXHRcdFx0dmFyIHZlbnVlT3B0aW9uID0gJCgkKCcuU1VJX09QVElPTlNfRFJPUERPV05fT1BUSU9OJylbaV0pO1xuXHRcdFx0aWYodmVudWVPcHRpb24uYXR0cigndmVudWVJZCcpPT1tYXJrZXJJZCl7XG5cdFx0XHRcdHZlbnVlT3B0aW9uLmNsaWNrKCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHQvLyBteUl0aW5lcmFyeS5yZW5kZXIoKTtcblxufSk7XG5cblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcblx0JCgnI2RheS1hZGRlcicpLmNsaWNrKCk7XG59KVxuXG5cblxuXG5cblxuXG5cblxuXG5cbiJdLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=