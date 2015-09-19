
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
	this.data = null;
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
	this[typeName].push(venueLookup(venueData[typeName].content,venueId));
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


function updateDay(dayId, venue, venueIds){
	console.log('day id', dayId);
	console.log('venue', venue);
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

Day.prototype.add = function(typeName,venueId){
	for(var i =0; i<this[typeName].length; i++){
		if (this[typeName][i]._id==venueId){
			return false
		}
	}
	this[typeName].push(venueLookup(venueData[typeName].content,venueId));
	var venueIds = {data:[]};
	for (var i = 0; i<this[typeName].length; i++){
		venueIds.data.push(this[typeName][i]._id);
	}
	console.log(venueIds);
	var serverVarKey = {
		Hotels:'hotel',
		Restaurants: 'restaurants',
		Activities: 'activities'
	}
	console.log(serverVarKey[typeName]);
	updateDay(this.data._id,serverVarKey[typeName],venueIds);
}



function addDay(day){
	$.ajax({
		method: "POST",
		url: "/api/newDay/"+day
	}).done(function(data){
		console.log(data);
		myItinerary.add(data);
		myItinerary.render();
		// return data;
	});
}

Itinerary.prototype.add = function(data){
	var newDay = new Day();
	newDay.data = data;
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
				deleteDay(Days[i].data._id);
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
	// myItinerary.add();
	addDay(1);
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










//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiXG5MLm1hcGJveC5hY2Nlc3NUb2tlbiA9ICdway5leUoxSWpvaVoyVnVaekEyTVRBaUxDSmhJam9pTTJFNVlXSXpNRFUwWW1ReFpHVmhNVEkwTldGa1pHSTVOVGsyTmprMk9Ea2lmUS5iYXRZbHZDYmU5dFdZRzhTY19PVFp3JztcbnZhciBtYXAgPSBMLm1hcGJveC5tYXAoJ21hcCcsICdtYXBib3guc3RyZWV0cycpLnNldFZpZXcoWzQwLjcxODI0MywgLTczLjk5ODY4XSwgMTQpO1xudmFyIG15TGF5ZXIgPSBMLm1hcGJveC5mZWF0dXJlTGF5ZXIoKS5hZGRUbyhtYXApO1xudmFyIG1hcmtlcnMgPSBbXTtcbnZhciBjdXJyZW50TWFya2VyO1xuXG52YXIgdmVudWVEYXRhO1xudmFyIGN1cnJlbnREYXk7XG5mdW5jdGlvbiBEYXkoKXtcblx0dGhpcy5jdXJyZW50RGF5ID0gZmFsc2U7XG5cdHRoaXMuSG90ZWxzID0gW107XG5cdHRoaXMuUmVzdGF1cmFudHMgPSBbXTtcblx0dGhpcy5BY3Rpdml0aWVzID0gW107XG5cdHRoaXMuZGF0YSA9IG51bGw7XG59XG5cbkRheS5wcm90b3R5cGUubWFrZUN1cnJlbnQgPSBmdW5jdGlvbigpe1xuXHR0aGlzLmN1cnJlbnREYXkgPSB0cnVlO1xufVxuXG5EYXkucHJvdG90eXBlLm5vbkN1cnJlbnQgPSBmdW5jdGlvbigpe1xuXHR0aGlzLmN1cnJlbnREYXkgPSBmYWxzZTtcbn1cblxuRGF5LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbih0eXBlTmFtZSx2ZW51ZUlkKXtcblx0Zm9yKHZhciBpID0wOyBpPHRoaXNbdHlwZU5hbWVdLmxlbmd0aDsgaSsrKXtcblx0XHRpZiAodGhpc1t0eXBlTmFtZV1baV0uX2lkPT12ZW51ZUlkKXtcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdH1cblx0fVxuXHR0aGlzW3R5cGVOYW1lXS5wdXNoKHZlbnVlTG9va3VwKHZlbnVlRGF0YVt0eXBlTmFtZV0uY29udGVudCx2ZW51ZUlkKSk7XG59XG5cbkRheS5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24odHlwZU5hbWUsdmVudWVJZCl7XG5cdHZhciB2ZW51ZXMgPSB0aGlzW3R5cGVOYW1lXTtcblx0dmFyIG5ld1ZlbnVlcyA9IFtdO1xuXHRmb3IgKHZhciBpID0wOyBpPHZlbnVlcy5sZW5ndGg7IGkrKyl7XG5cdFx0aWYodmVudWVzW2ldLl9pZCE9dmVudWVJZCl7XG5cdFx0XHRuZXdWZW51ZXMucHVzaCh2ZW51ZXNbaV0pXG5cdFx0fVxuXHR9XG5cdHRoaXNbdHlwZU5hbWVdPW5ld1ZlbnVlcztcbn1cblxuZnVuY3Rpb24gSXRpbmVyYXJ5KCl7XG5cdHRoaXMuZGF5cyA9IFtdO1xufVxuXG5mdW5jdGlvbiBkaXNwbGF5RGF5KGRheUlkKXtcblx0JC5hamF4KHtcblx0XHRtZXRob2Q6IFwiR0VUXCIsXG5cdFx0dXJsOiBcIi9hcGkvZ2V0RGF5L1wiK2RheUlkXG5cdH0pLmRvbmUoZnVuY3Rpb24oZGF0YSl7XG5cdFx0Y29uc29sZS5sb2coZGF0YSk7XG5cdH0pO1xufVxuXG5cbmZ1bmN0aW9uIGRlbGV0ZURheShkYXlJZCl7XG5cdCQuYWpheCh7XG5cdFx0bWV0aG9kOiBcIkRFTEVURVwiLFxuXHRcdHVybDogXCIvYXBpL2RlbGV0ZURheS9cIitkYXlJZFxuXHR9KS5kb25lKGZ1bmN0aW9uKGRhdGEpe1xuXHRcdGNvbnNvbGUubG9nKGRhdGEpO1xuXHR9KTtcbn1cblxuXG5mdW5jdGlvbiB1cGRhdGVEYXkoZGF5SWQsIHZlbnVlLCB2ZW51ZUlkcyl7XG5cdGNvbnNvbGUubG9nKCdkYXkgaWQnLCBkYXlJZCk7XG5cdGNvbnNvbGUubG9nKCd2ZW51ZScsIHZlbnVlKTtcblx0Y29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkodmVudWVJZHMpKTtcblx0JC5hamF4KHtcblx0XHRtZXRob2Q6IFwiUE9TVFwiLFxuXHRcdHVybDogXCIvYXBpL2FkZHRvRGF5L1wiK2RheUlkK1wiL1wiK3ZlbnVlK1wiL1wiLFxuXHRcdGRhdGE6SlNPTi5zdHJpbmdpZnkodmVudWVJZHMpLFxuXHRcdGNvbnRlbnRUeXBlOlwiYXBwbGljYXRpb24vanNvblwiXG5cdH0pLmRvbmUoZnVuY3Rpb24oZGF0YSl7XG5cdFx0Y29uc29sZS5sb2coZGF0YSk7XG5cdH0pO1xufVxuXG5EYXkucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKHR5cGVOYW1lLHZlbnVlSWQpe1xuXHRmb3IodmFyIGkgPTA7IGk8dGhpc1t0eXBlTmFtZV0ubGVuZ3RoOyBpKyspe1xuXHRcdGlmICh0aGlzW3R5cGVOYW1lXVtpXS5faWQ9PXZlbnVlSWQpe1xuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0fVxuXHR9XG5cdHRoaXNbdHlwZU5hbWVdLnB1c2godmVudWVMb29rdXAodmVudWVEYXRhW3R5cGVOYW1lXS5jb250ZW50LHZlbnVlSWQpKTtcblx0dmFyIHZlbnVlSWRzID0ge2RhdGE6W119O1xuXHRmb3IgKHZhciBpID0gMDsgaTx0aGlzW3R5cGVOYW1lXS5sZW5ndGg7IGkrKyl7XG5cdFx0dmVudWVJZHMuZGF0YS5wdXNoKHRoaXNbdHlwZU5hbWVdW2ldLl9pZCk7XG5cdH1cblx0Y29uc29sZS5sb2codmVudWVJZHMpO1xuXHR2YXIgc2VydmVyVmFyS2V5ID0ge1xuXHRcdEhvdGVsczonaG90ZWwnLFxuXHRcdFJlc3RhdXJhbnRzOiAncmVzdGF1cmFudHMnLFxuXHRcdEFjdGl2aXRpZXM6ICdhY3Rpdml0aWVzJ1xuXHR9XG5cdGNvbnNvbGUubG9nKHNlcnZlclZhcktleVt0eXBlTmFtZV0pO1xuXHR1cGRhdGVEYXkodGhpcy5kYXRhLl9pZCxzZXJ2ZXJWYXJLZXlbdHlwZU5hbWVdLHZlbnVlSWRzKTtcbn1cblxuXG5cbmZ1bmN0aW9uIGFkZERheShkYXkpe1xuXHQkLmFqYXgoe1xuXHRcdG1ldGhvZDogXCJQT1NUXCIsXG5cdFx0dXJsOiBcIi9hcGkvbmV3RGF5L1wiK2RheVxuXHR9KS5kb25lKGZ1bmN0aW9uKGRhdGEpe1xuXHRcdGNvbnNvbGUubG9nKGRhdGEpO1xuXHRcdG15SXRpbmVyYXJ5LmFkZChkYXRhKTtcblx0XHRteUl0aW5lcmFyeS5yZW5kZXIoKTtcblx0XHQvLyByZXR1cm4gZGF0YTtcblx0fSk7XG59XG5cbkl0aW5lcmFyeS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oZGF0YSl7XG5cdHZhciBuZXdEYXkgPSBuZXcgRGF5KCk7XG5cdG5ld0RheS5kYXRhID0gZGF0YTtcblx0aWYoY3VycmVudERheSl7XG5cdFx0Y3VycmVudERheS5ub25DdXJyZW50KCk7XG5cdH1cblx0bmV3RGF5Lm1ha2VDdXJyZW50KCk7XG5cdHRoaXMuZGF5cy5wdXNoKG5ld0RheSk7XG5cdGN1cnJlbnREYXkgPSBuZXdEYXk7XG5cbn1cblxuSXRpbmVyYXJ5LnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbigpe1xuXHR2YXIgRGF5cyA9IHRoaXMuZGF5cztcblx0Zm9yICh2YXIgaSA9MDsgaTxEYXlzLmxlbmd0aDsgaSsrKXtcblx0XHRpZiAoRGF5c1tpXS5jdXJyZW50RGF5KXtcblx0XHRcdGNvbnNvbGUubG9nKGN1cnJlbnREYXkpO1xuXHRcdFx0aWYoRGF5cy5sZW5ndGg+MSl7XG5cdFx0XHRcdGRlbGV0ZURheShEYXlzW2ldLmRhdGEuX2lkKTtcblx0XHRcdFx0RGF5cy5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdGN1cnJlbnREYXkgPSBEYXlzW01hdGgubWF4KDAsaS0xKV07XG5cdFx0XHRcdGN1cnJlbnREYXkubWFrZUN1cnJlbnQoKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGFsZXJ0KFwiWW91IGFyZSByZW1vdmluZyB0aGUgb25seSBkYXkgbGVmdCBpbiB5b3VyIHZhY2F0aW9uIVwiKTtcblx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxufVxuXG5JdGluZXJhcnkucHJvdG90eXBlLnNlbGVjdCA9IGZ1bmN0aW9uKGluZGV4KXtcblx0Y3VycmVudERheS5ub25DdXJyZW50KCk7XG5cdHRoaXMuZGF5c1tpbmRleF0ubWFrZUN1cnJlbnQoKTtcblx0Y3VycmVudERheT10aGlzLmRheXNbaW5kZXhdO1xufVxuXG52YXIgJGl0aW5lcmFyeVNlbGVjdG9ySFRNTCA9ICQoJzxidXR0b24gY2xhc3M9XCJkYXktc2VsZWN0b3IgaXRpbmVyYXJ5LXNlbGVjdG9yIFNVSV9TRUNPTkRBUllfQlVUVE9OXCIgaW5kZXg+PC9idXR0b24+Jyk7XG52YXIgJGl0aW5lcmFyeUNvbnRlbnRDb250ZW50SFRNTCA9ICQoJzxkaXYgY2xhc3M9XCJpdGluZXJhcnktY29udGVudC1jb250ZW50IFNVSV9ISURFXCI+PC9kaXY+Jyk7XG52YXIgJENvbnRlbnRTZWN0aW9uSFRNTCA9ICQoJzxkaXYgY2xhc3M9XCJjb250ZW50LXNlY3Rpb25cIiB2ZW51ZVR5cGU+PC9kaXY+Jyk7XG52YXIgJENvbnRlbnRTZWN0aW9uSGVhZGVySFRNTCA9ICQoJzxkaXYgY2xhc3M9XCJjb250ZW50LXNlY3Rpb24taGVhZGVyXCI+PGRpdiBjbGFzcz1cIlNVSV9WQV9URVhUV1JBUFBFUlwiPjxkaXYgY2xhc3M9XCJTVUlfVkFNSURETEVfVEVYVFdSQVBQRVJfSU5ORVJURVhUXCI+PC9kaXY+PC9kaXY+PC9kaXY+Jyk7XG52YXIgJENvbnRlbnRTZWN0aW9uQm9keUhUTUwgPSAkKCc8ZGl2IGNsYXNzPVwiY29udGVudC1zZWN0aW9uLWJvZHlcIiB2ZW51ZUlkPjxkaXYgY2xhc3M9XCJTVUlfVkFfVEVYVFdSQVBQRVJcIj48ZGl2IGNsYXNzPVwiU1VJX1ZBTUlERExFX1RFWFRXUkFQUEVSX0lOTkVSVEVYVFwiPjwvZGl2PjwvZGl2PjwvZGl2PicpO1xudmFyICRDb250ZW50U2VjdGlvblRleHRIVE1MID0gJCgnPGRpdiBjbGFzcz1cImNvbnRlbnQtc2VjdGlvbi10ZXh0XCI+PGRpdiBjbGFzcz1cIlNVSV9WQV9URVhUV1JBUFBFUlwiPjxkaXYgY2xhc3M9XCJTVUlfVkFNSURETEVfVEVYVFdSQVBQRVJfSU5ORVJURVhUXCI+PC9kaXY+PC9kaXY+PC9kaXY+Jyk7XG52YXIgJENvbnRlbnRTZWN0aW9uRGVsZXRlYnV0dG9uID0gJCgnPGRpdiBjbGFzcz1cImNvbnRlbnQtc2VjdGlvbi1kZWxldGVidXR0b25cIj48ZGl2IGNsYXNzPVwiU1VJX1ZBX1RFWFRXUkFQUEVSXCI+PGRpdiBjbGFzcz1cIlNVSV9WQU1JRERMRV9URVhUV1JBUFBFUl9JTk5FUlRFWFQgaWNvbi1ydGUtZGVsZXRlXCI+PC9kaXY+PC9kaXY+PC9kaXY+JylcblxuXG5cblxuZnVuY3Rpb24gYWRkRGF5SFRNTCgkZGF5SFRNTCwgZGF5LCB2ZW51ZVR5cGUsIHZlbnVlVGl0bGVUZXh0KXtcblx0dmFyICRuZXdDb250ZW50U2VjdGlvbkhUTUwgPSAkQ29udGVudFNlY3Rpb25IVE1MLmNsb25lKCk7XG5cdCRuZXdDb250ZW50U2VjdGlvbkhUTUwuYXR0cigndmVudWVUeXBlJywgdmVudWVUeXBlKTtcblx0dmFyICRuZXdDb250ZW50U2VjdGlvbkhlYWRlckhUTUwgPSAkQ29udGVudFNlY3Rpb25IZWFkZXJIVE1MLmNsb25lKCk7XG5cdCRuZXdDb250ZW50U2VjdGlvbkhlYWRlckhUTUwuZmluZCgnLlNVSV9WQU1JRERMRV9URVhUV1JBUFBFUl9JTk5FUlRFWFQnKS50ZXh0KHZlbnVlVGl0bGVUZXh0KTtcblx0JG5ld0NvbnRlbnRTZWN0aW9uSFRNTC5hcHBlbmQoJG5ld0NvbnRlbnRTZWN0aW9uSGVhZGVySFRNTCk7XG5cdGlmKGRheVt2ZW51ZVR5cGVdLmxlbmd0aD09MCl7XG5cdFx0dmFyICRuZXdDb250ZW50U2VjdGlvbkJvZHlIVE1MID0gJENvbnRlbnRTZWN0aW9uQm9keUhUTUwuY2xvbmUoKTtcblx0XHR2YXIgJG5ld0NvbnRlbnRTZWN0aW9uVGV4dEhUTUwgPSAkQ29udGVudFNlY3Rpb25UZXh0SFRNTC5jbG9uZSgpO1xuXHRcdCRuZXdDb250ZW50U2VjdGlvblRleHRIVE1MLmZpbmQoJy5TVUlfVkFNSURETEVfVEVYVFdSQVBQRVJfSU5ORVJURVhUJykuYWRkQ2xhc3MoJ3NoYWR5LXRleHQnKTtcblx0XHQkbmV3Q29udGVudFNlY3Rpb25UZXh0SFRNTC5maW5kKCcuU1VJX1ZBTUlERExFX1RFWFRXUkFQUEVSX0lOTkVSVEVYVCcpLnRleHQoJ1NlbGVjdCBmcm9tIGFib3ZlJyk7XG5cdFx0JG5ld0NvbnRlbnRTZWN0aW9uQm9keUhUTUwuYXBwZW5kKCRuZXdDb250ZW50U2VjdGlvblRleHRIVE1MKTtcblx0XHQkbmV3Q29udGVudFNlY3Rpb25IVE1MLmFwcGVuZCgkbmV3Q29udGVudFNlY3Rpb25Cb2R5SFRNTCk7XG5cdH0gZWxzZSB7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGo8ZGF5W3ZlbnVlVHlwZV0ubGVuZ3RoO2orKyl7XG5cdFx0XHR2YXIgJG5ld0NvbnRlbnRTZWN0aW9uQm9keUhUTUwgPSAkQ29udGVudFNlY3Rpb25Cb2R5SFRNTC5jbG9uZSgpO1xuXHRcdFx0JG5ld0NvbnRlbnRTZWN0aW9uQm9keUhUTUwuYXR0cigndmVudWVJZCcsIGRheVt2ZW51ZVR5cGVdW2pdLl9pZCk7XG5cdFx0XHR2YXIgJG5ld0NvbnRlbnRTZWN0aW9uVGV4dEhUTUwgPSAkQ29udGVudFNlY3Rpb25UZXh0SFRNTC5jbG9uZSgpO1xuXHRcdFx0JG5ld0NvbnRlbnRTZWN0aW9uVGV4dEhUTUwuZmluZCgnLlNVSV9WQU1JRERMRV9URVhUV1JBUFBFUl9JTk5FUlRFWFQnKS50ZXh0KGRheVt2ZW51ZVR5cGVdW2pdLm5hbWUpO1xuXHRcdFx0dmFyICRuZXdDb250ZW50U2VjdGlvbkRlbGV0ZWJ1dHRvbiA9ICRDb250ZW50U2VjdGlvbkRlbGV0ZWJ1dHRvbi5jbG9uZSgpO1xuXHRcdFx0JG5ld0NvbnRlbnRTZWN0aW9uQm9keUhUTUwuYXBwZW5kKCRuZXdDb250ZW50U2VjdGlvblRleHRIVE1MKTtcblx0XHRcdCRuZXdDb250ZW50U2VjdGlvbkJvZHlIVE1MLmFwcGVuZCgkbmV3Q29udGVudFNlY3Rpb25EZWxldGVidXR0b24pO1xuXHRcdFx0JG5ld0NvbnRlbnRTZWN0aW9uSFRNTC5hcHBlbmQoJG5ld0NvbnRlbnRTZWN0aW9uQm9keUhUTUwpO1xuXHRcdH1cblx0fVxuXHQkZGF5SFRNTC5hcHBlbmQoJG5ld0NvbnRlbnRTZWN0aW9uSFRNTCk7XG59XG5cbkl0aW5lcmFyeS5wcm90b3R5cGUucmVuZGVyPWZ1bmN0aW9uKCl7XG5cdGNvbnNvbGUubG9nKCdyZW5kZXJpbmcnKTtcblx0JCgnLml0aW5lcmFyeS1jb250ZW50LWNvbnRlbnQnKS5yZW1vdmUoKTtcblx0JCgnLmRheS1zZWxlY3RvcicpLnJlbW92ZSgpO1xuXHRmb3IgKHZhciBpID0gMDsgaTx0aGlzLmRheXMubGVuZ3RoOyBpKyspe1xuXHRcdHZhciB0aGlzRGF5ID0gdGhpcy5kYXlzW2ldO1xuXHRcdHZhciAkbmV3SXRpbmVyYXJ5U2VsZWN0b3JIVE1MID0gJGl0aW5lcmFyeVNlbGVjdG9ySFRNTC5jbG9uZSgpO1xuXHRcdCRuZXdJdGluZXJhcnlTZWxlY3RvckhUTUwuYXR0cignaW5kZXgnLCBpKTtcblx0XHQkbmV3SXRpbmVyYXJ5U2VsZWN0b3JIVE1MLnRleHQoaSsxKTtcblx0XHR2YXIgJG5ld0RheUhUTUwgPSAkaXRpbmVyYXJ5Q29udGVudENvbnRlbnRIVE1MLmNsb25lKCk7XG5cdFx0aWYodGhpc0RheS5jdXJyZW50RGF5KXtcblx0XHRcdCRuZXdEYXlIVE1MLnJlbW92ZUNsYXNzKCdTVUlfSElERScpO1xuXHRcdFx0JG5ld0l0aW5lcmFyeVNlbGVjdG9ySFRNTC5yZW1vdmVDbGFzcygnU1VJX1NFQ09OREFSWV9CVVRUT04nKTtcblx0XHRcdCRuZXdJdGluZXJhcnlTZWxlY3RvckhUTUwuYWRkQ2xhc3MoJ1NVSV9QUklNQVJZX0JVVFRPTicpO1xuXHRcdH1cblx0XHQkKCcjaXRpbmVyYXJ5LWNvbnRlbnQnKS5maW5kKCcuaXRpbmVyYXJ5LWhlYWRlcicpLmZpbmQoJy5TVUlfVkFNSURETEVfVEVYVFdSQVBQRVJfSU5ORVJURVhUJykuYXBwZW5kKCRuZXdJdGluZXJhcnlTZWxlY3RvckhUTUwpO1xuXHRcdGFkZERheUhUTUwoJG5ld0RheUhUTUwsIHRoaXNEYXksICdIb3RlbHMnLCAnTXkgSG90ZWwnKTtcblx0XHRhZGREYXlIVE1MKCRuZXdEYXlIVE1MLCB0aGlzRGF5LCAnUmVzdGF1cmFudHMnLCAnTXkgUmVzdGF1cmFudHMnKTtcblx0XHRhZGREYXlIVE1MKCRuZXdEYXlIVE1MLCB0aGlzRGF5LCAnQWN0aXZpdGllcycsICdNeSBBY3Rpdml0aWVzJyk7XG5cdFx0JCgnI2l0aW5lcmFyeS1jb250ZW50JykuYXBwZW5kKCRuZXdEYXlIVE1MKTtcblx0fVxuXG5cblx0bWFya2VycyA9IFtdO1xuXG5cdGZvciAodmFyIGVsZW1lbnQgaW4gdmVudWVEYXRhKXtcblx0XHR2YXIgdmVudWVzID0gdmVudWVEYXRhW2VsZW1lbnRdLmNvbnRlbnQ7XG5cdFx0dmFyIHZlbnVlVHlwZSA9IHZlbnVlRGF0YVtlbGVtZW50XS50eXBlO1xuXHRcdGZvcih2YXIgaT0wOyBpPHZlbnVlcy5sZW5ndGg7aSsrKXtcblx0XHRcdHZhciB2ZW51ZSA9IHZlbnVlc1tpXTtcblx0XHRcdHZhciBtYXJrZXJTdGF0ZSA9IGZhbHNlO1xuXG5cdFx0XHQvLyBjb25zb2xlLmxvZyh2ZW51ZS5faWQsIGN1cnJlbnRNYXJrZXJJZCk7XG5cdFx0XHRpZih2ZW51ZS5faWQgPT0gY3VycmVudE1hcmtlcklkKXtcblx0XHRcdFx0bWFya2VyU3RhdGUgPSAnbW91c2VTZWxlY3RlZCc7XG5cdFx0XHR9XG5cdFx0XHRmb3IgKHZhciBqID0gMDsgajx0aGlzLmRheXMubGVuZ3RoOyBqKyspe1xuXHRcdFx0XHR2YXIgdGhpc0RheSA9IHRoaXMuZGF5c1tqXTtcblx0XHRcdFx0Zm9yICh2YXIgayA9IDA7IGs8dGhpc0RheVt2ZW51ZVR5cGVdLmxlbmd0aDsgaysrKXtcblx0XHRcdFx0XHRpZih2ZW51ZS5faWQgPT0gdGhpc0RheVt2ZW51ZVR5cGVdW2tdLl9pZCl7XG5cdFx0XHRcdFx0XHRpZih0aGlzRGF5LmN1cnJlbnREYXkpe1xuXHRcdFx0XHRcdFx0XHRtYXJrZXJTdGF0ZSA9ICdjdXJyZW50U2VsZWN0ZWQnO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0bWFya2VyU3RhdGUgPSAnbm9uY3VycmVudFNlbGVjdGVkJztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGN1cnJlbnRNYXJrZXIgPSBNYXJrZXIobWFya2VyU3RhdGUsdmVudWUsdmVudWVUeXBlKVxuXHRcdFx0bWFya2Vycy5wdXNoKGN1cnJlbnRNYXJrZXIpO1xuXHRcdH1cblx0fVxuXHRteUxheWVyLnNldEdlb0pTT04obWFya2Vycyk7XG59XG5cbnZhciBteUl0aW5lcmFyeSA9IG5ldyBJdGluZXJhcnkoKTtcblxudmFyIGN1cnJlbnRNYXJrZXJJZCA9IG51bGw7XG5cbmZ1bmN0aW9uIE1hcmtlcihzdGF0ZSwgdmVudWUsIHZlbnVlVHlwZSl7XG5cdHJldHVybntcblx0XHRcdGlkOiB2ZW51ZS5faWQsXG5cdFx0ICAgIHR5cGU6ICdGZWF0dXJlJyxcblx0XHQgICAgZ2VvbWV0cnk6IHtcblx0XHQgICAgICAgIHR5cGU6ICdQb2ludCcsXG5cdFx0ICAgICAgICBjb29yZGluYXRlczogXG5cdFx0ICAgICAgICBbXG5cdFx0ICAgICAgICAgIHZlbnVlLnBsYWNlWzBdLmxvY2F0aW9uWzFdLFxuXHRcdCAgICAgICAgICB2ZW51ZS5wbGFjZVswXS5sb2NhdGlvblswXVxuXHRcdCAgICAgICAgXVxuXHRcdCAgICB9LFxuXHRcdCAgICBwcm9wZXJ0aWVzOiB7XG5cdFx0ICAgICAgICB0aXRsZTogdmVudWUubmFtZSxcblx0XHQgICAgICAgIGRlc2NyaXB0aW9uOiB2ZW51ZS5kZXNjcmlwdGlvbnx8JzxkaXYgY2xhc3MgPSBcIlNVSV9QUklNQVJZX0JVVFRPTlwiPmRlc2NyaXB0aW9uIHBsYWNlaG9sZGVyPC9kaXY+Jyxcblx0XHQgICAgICAgICdtYXJrZXItc2l6ZSc6ICdsYXJnZScsXG5cdFx0ICAgICAgICAnbWFya2VyLWNvbG9yJzogKHN0YXRlPT0nY3VycmVudFNlbGVjdGVkJyk/KHZlbnVlVHlwZSA9PSAnSG90ZWxzJyk/JyM2REQ4QkInOih2ZW51ZVR5cGUgPT0gJ1Jlc3RhdXJhbnRzJyk/JyM1MjUyQ0EnOicjRkZDNzZGJ1xuXHRcdCAgICAgICAgOihzdGF0ZT09J25vbmN1cnJlbnRTZWxlY3RlZCcpPyh2ZW51ZVR5cGUgPT0gJ0hvdGVscycpPycjRTJGN0YxJzoodmVudWVUeXBlID09ICdSZXN0YXVyYW50cycpPycjRENEQ0Y0JzonI0ZGRjRFMidcblx0XHQgICAgICAgIDooc3RhdGU9PSdtb3VzZVNlbGVjdGVkJyk/KHZlbnVlVHlwZSA9PSAnSG90ZWxzJyk/JyNBN0U4RDYnOih2ZW51ZVR5cGUgPT0gJ1Jlc3RhdXJhbnRzJyk/JyM5Nzk3REYnOicjRkZEREE5J1xuXHRcdCAgICAgICAgOicjQkRCREJEJyxcblx0XHQgICAgICAgICdtYXJrZXItc3ltYm9sJzogKHZlbnVlVHlwZSA9PSAnSG90ZWxzJyk/J2xvZGdpbmcnOih2ZW51ZVR5cGUgPT0gJ1Jlc3RhdXJhbnRzJyk/J3Jlc3RhdXJhbnQnOidzdGFyLXN0cm9rZWQnXG5cdFx0ICAgIH1cblx0XHR9XG59XG5cbihmdW5jdGlvbigkKXtcblx0JChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcblx0XHQkLmFqYXgoe1xuXHRcdFx0bWV0aG9kOiBcIkdFVFwiLFxuXHRcdFx0dXJsOiBcIi9hcGkvdmVudWVzXCJcblx0XHR9KS5kb25lKGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0dmVudWVEYXRhID0gZGF0YTtcblx0XHRcdG15SXRpbmVyYXJ5LnJlbmRlcigpO1xuXHRcdH0pO1xuXHR9KTtcbn0oalF1ZXJ5KSk7XG5cblxuXG5mdW5jdGlvbiB2ZW51ZUxvb2t1cCh2ZW51ZXMsIGlkKXtcblx0Zm9yKHZhciBpPTA7IGk8dmVudWVzLmxlbmd0aDsgaSsrKXtcblx0XHRpZih2ZW51ZXNbaV0uX2lkPT1pZCl7XG5cdFx0XHRyZXR1cm4gdmVudWVzW2ldO1xuXHRcdH1cblx0fVxufVxuXG4kKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIFwiLnZlbnVlLWFkZFwiLCBmdW5jdGlvbihlKXtcbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuICAgIHZhciB2ZW51ZUNvbnRlbnQgPSAkdGhpcy5jbG9zZXN0KCcudmVudWUtY29udGVudCcpO1xuICAgIHZhciB0eXBlID0gJHRoaXMuY2xvc2VzdCgnLnZlbnVlLWNvbnRlbnQnKS5hdHRyKCd2ZW51ZVR5cGUnKTtcbiAgICB2YXIgc2VsZWN0ZWRWZW51ZURpdiA9IHZlbnVlQ29udGVudC5maW5kKCcuU0VMRUNURURfRFJPUERPV05fT1BUSU9OJyk7XG4gICAgdmFyIGlkID0gc2VsZWN0ZWRWZW51ZURpdi5hdHRyKCd2ZW51ZUlkJyk7XG4gICAgaWYoaWQpe1xuXHQgICAgY3VycmVudERheS5hZGQodHlwZSxpZCk7XG5cdFx0bXlJdGluZXJhcnkucmVuZGVyKCk7XG4gICAgfVxufSk7XG5cbiQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgXCIuY29udGVudC1zZWN0aW9uLWRlbGV0ZWJ1dHRvblwiLCBmdW5jdGlvbihlKXtcbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuICAgIHZhciAkY29udGVudFNlY3Rpb24gPSAkdGhpcy5jbG9zZXN0KCcuY29udGVudC1zZWN0aW9uJyk7XG4gICAgdmFyIHR5cGUgPSAkY29udGVudFNlY3Rpb24uYXR0cigndmVudWVUeXBlJyk7XG4gICAgdmFyIGlkID0gJHRoaXMuY2xvc2VzdCgnLmNvbnRlbnQtc2VjdGlvbi1ib2R5JykuYXR0cigndmVudWVJZCcpO1xuICAgIGN1cnJlbnREYXkuZGVsZXRlKHR5cGUsaWQpO1xuXHRteUl0aW5lcmFyeS5yZW5kZXIoKTtcbn0pO1xuXG4kKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIFwiI2RheS1hZGRlclwiLCBmdW5jdGlvbihlKXtcblx0Ly8gbXlJdGluZXJhcnkuYWRkKCk7XG5cdGFkZERheSgxKTtcbn0pO1xuXG4kKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIFwiLmRheS1zZWxlY3RvclwiLCBmdW5jdGlvbihlKXtcbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuICAgIHZhciBpbmRleCA9ICR0aGlzLmF0dHIoJ2luZGV4Jyk7XG4gICAgbXlJdGluZXJhcnkuc2VsZWN0KGluZGV4KTtcblx0bXlJdGluZXJhcnkucmVuZGVyKCk7XG59KTtcblxuJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5pdGluZXJhcnktZm9vdGVyLWRlbGV0ZWJ1dHRvblwiLCBmdW5jdGlvbihlKXtcblx0bXlJdGluZXJhcnkuZGVsZXRlKCk7XG5cdG15SXRpbmVyYXJ5LnJlbmRlcigpO1xufSk7XG5cbm15TGF5ZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXHR2YXIgbWFya2VySWQgPSBlLmxheWVyLmZlYXR1cmUuaWQ7XG5cdGN1cnJlbnRNYXJrZXJJZCA9IG1hcmtlcklkO1xuXHRmb3IodmFyIGkgPSAwOyBpPCQoJy5TVUlfT1BUSU9OU19EUk9QRE9XTl9PUFRJT04nKS5sZW5ndGg7aSsrKXtcblx0XHRpZigkKCcuU1VJX09QVElPTlNfRFJPUERPV05fT1BUSU9OJylbaV0pe1xuXHRcdFx0dmFyIHZlbnVlT3B0aW9uID0gJCgkKCcuU1VJX09QVElPTlNfRFJPUERPV05fT1BUSU9OJylbaV0pO1xuXHRcdFx0aWYodmVudWVPcHRpb24uYXR0cigndmVudWVJZCcpPT1tYXJrZXJJZCl7XG5cdFx0XHRcdHZlbnVlT3B0aW9uLmNsaWNrKCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHQvLyBteUl0aW5lcmFyeS5yZW5kZXIoKTtcblxufSk7XG5cblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcblx0JCgnI2RheS1hZGRlcicpLmNsaWNrKCk7XG59KVxuXG5cblxuXG5cblxuXG5cblxuIl0sImZpbGUiOiJhcHAuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==