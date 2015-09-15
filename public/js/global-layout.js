/////////////////////////
////// HELPER FUNCTIONS
/////////////////////////

// var test = null;

// var console = console;
// var monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN","JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function trimText(){
    var descriptions = $("body").find(".SUI_TRIMMABLE");
    //console.log(descriptions);
    function trim(index, text){
        return text.replace(/\W*\s(\S)*$/, '...');
    }
    for(var i=0; i<descriptions.length; i++){
        var p = jQuery(descriptions[i]).find(".SUI_VAMIDDLE_TEXTWRAPPER_INNERTEXT");
        var divh = jQuery(descriptions[i]).height();
        while ($(p).outerHeight()>divh) {
            $(p).text(trim);
        }
        console.log(descriptions[i]);
    }
}


/////////////////////////
////// SUI CHECKBOX
/////////////////////////

$("body").on("click", ".SUI_CHECKBOX", function(e){
    var $this = $(this);
    if($this.hasClass('DISABLED-INPUT')){
        return;
    } else {
        $this.toggleClass('CHECKED');
        $this.toggleClass('UNCHECKED');
        $this.find(".SUI_VAMIDDLE_TEXTWRAPPER_INNERTEXT").toggleClass('icon-check-2');
    }
});


/////////////////////////
////// SUI RADIOBUTTON
/////////////////////////

$("body").on("click", ".SUI_RADIOBUTTON", function(e){
    var $this = $(this);
    if($this.hasClass('DISABLED-INPUT')){
        return;
    } else {
        $this.toggleClass('CHECKED');
        $this.toggleClass('UNCHECKED');
        $this.find(".SUI_VAMIDDLE_TEXTWRAPPER_INNERTEXT").toggleClass('icon-radio-button-circle');
    }
});

/////////////////////////
////// SUI TOGGLE
/////////////////////////


$("body").on("click", ".SUI_TOGGLE", function(e){
    var $this = $(this);
    if($this.hasClass('DISABLED-INPUT')){
        return;
    } else {
        $this.toggleClass('TOGGLE_ON');
        $this.toggleClass('TOGGLE_OFF');
    }
});

/////////////////////////
////// SUI DROPDOWN
/////////////////////////

var $activeSuiOptionButton;

$("body").on("click", ".SUI_OPTIONS_BUTTON", function(e){
    var $this = $(this);
    var $parent = $this.parent();
    if($parent.hasClass("ACTIVE_SUI_OPTIONS_DROPDOWN")){
        $parent.removeClass("ACTIVE_SUI_OPTIONS_DROPDOWN");
        $activeSuiOptionButton = null;
    } else {
        if($activeSuiOptionButton){
            $activeSuiOptionButton.removeClass("ACTIVE_SUI_OPTIONS_DROPDOWN");
        }
        $parent.addClass("ACTIVE_SUI_OPTIONS_DROPDOWN");
        $activeSuiOptionButton = $parent;
    }
});

$("body").on("click", ".SUI_OPTIONS_DROPDOWN_OPTION", function(e){
    var $this = $(this);
    $this.parent().find(".SUI_OPTIONS_DROPDOWN_OPTION").removeClass("SELECTED_DROPDOWN_OPTION");
    $this.addClass("SELECTED_DROPDOWN_OPTION");
    var $wrap = $this.parent().parent();
    var $status = $this.first().first();
    var $activeStatus = ($this.parent().parent()).find(".SUI_OPTIONS_BUTTON_TEXT");
    $activeStatus.text($status.text());
    $wrap.removeClass("ACTIVE_SUI_OPTIONS_DROPDOWN");
    $wrap.addClass("SELECTED_SUI_OPTIONS_DROPDOWN");
    setTimeout(function(){
        $wrap.removeClass("SELECTED_SUI_OPTIONS_DROPDOWN");
    },100);
});


$("body").on("click", ".SUI_SECONDARY_OPTION", function(e){
    var $this = $(this);
    $this.toggleClass('Selected_Option');
    var $optionCheckbox = $this.find('.SUI_CHECKBOX');
    $optionCheckbox.toggleClass('CHECKED');
    $optionCheckbox.toggleClass('UNCHECKED');
    $optionCheckbox.find(".SUI_VAMIDDLE_TEXTWRAPPER_INNERTEXT").toggleClass('icon-check-2');
    if($this.hasClass('Selected_Option') && $optionCheckbox.hasClass('UNCHECKED')){
    $optionCheckbox.toggleClass('CHECKED');
    $optionCheckbox.toggleClass('UNCHECKED');
    $optionCheckbox.find(".SUI_VAMIDDLE_TEXTWRAPPER_INNERTEXT").toggleClass('icon-check-2');
    }
    if(!$this.hasClass('Selected_Option') && $optionCheckbox.hasClass('CHECKED')){
    $optionCheckbox.toggleClass('CHECKED');
    $optionCheckbox.toggleClass('UNCHECKED');
    $optionCheckbox.find(".SUI_VAMIDDLE_TEXTWRAPPER_INNERTEXT").toggleClass('icon-check-2');
    }
});


$("body").on("click", ".SUI_RADIO_OPTION", function(e){
    var $this = $(this);
    var thisIsSelected = $this.hasClass('Selected_Option');
    var $parent = $this.closest(".SUI_RADIO_OPTIONS");
    var $selectedOption = $parent.find('.Selected_Option');
    if($selectedOption){
        $selectedOption.removeClass('Selected_Option');
        var $selectedOptionRadioButton = $selectedOption.find('.SUI_RADIOBUTTON');
        $selectedOptionRadioButton.removeClass('CHECKED');
        $selectedOptionRadioButton.addClass('UNCHECKED');
        $selectedOptionRadioButton.find(".SUI_VAMIDDLE_TEXTWRAPPER_INNERTEXT").removeClass('icon-radio-button-circle');
    }
    $this.addClass('Selected_Option');
    var $thisRadioButton = $this.find('.SUI_RADIOBUTTON');
    $thisRadioButton.removeClass('UNCHECKED');
    $thisRadioButton.addClass('CHECKED');
    $thisRadioButton.find(".SUI_VAMIDDLE_TEXTWRAPPER_INNERTEXT").addClass('icon-radio-button-circle');
});


$("body").on("click", "#intercom-close-button", function(e){
    $('#intercom-demo').addClass('SUI_HIDE');
});



/////////////////////////
////// INTERCOM
/////////////////////////



$(window).load(function(){
    trimText();
    setTimeout(function(){
        $('#intercom-demo').removeClass('SUI_HIDE');
        setTimeout(function(){ 
            $('#intercom-profile-pic').removeClass('initial-intercom-profile-pic');
        }, 500);
        setTimeout(function(){ 
            $('#intercom-profile-pic').attr('src', '/images/intercom-profile.png');
        }, 1500);
        setTimeout(function(){ 
            $('#intercom-profile-notification').removeClass('SUI_HIDE');
            $('#intercom-comment').removeClass('SUI_HIDE');
        }, 2000);
    }, ((Math.random()+1)*1000))
});





/////////////////////////
////// for stylized checkmarks
/////////////////////////
    $(document).ready(function(){
      $('input').iCheck({
        checkboxClass: 'icheckbox_minimal-SUI',
        radioClass: 'iradio_minimal-SUI',
        increaseArea: '20%' // optional
      });
    });




/////////////////////////
////// SUI CHECKBOX
/////////////////////////

$("body").on("click", ".SUI_MODAL_CLOSER", function(e){
    var $this = $(this);
    $this.closest(".SUI_MODAL").addClass("SUI_HIDE");
});


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJnbG9iYWwtbGF5b3V0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbi8vIHZhciB0ZXN0ID0gbnVsbDtcblxuLy8gdmFyIGNvbnNvbGUgPSBjb25zb2xlO1xuLy8gdmFyIG1vbnRoTmFtZXMgPSBbXCJKQU5cIiwgXCJGRUJcIiwgXCJNQVJcIiwgXCJBUFJcIiwgXCJNQVlcIiwgXCJKVU5cIixcIkpVTFwiLCBcIkFVR1wiLCBcIlNFUFwiLCBcIk9DVFwiLCBcIk5PVlwiLCBcIkRFQ1wiXTtcblxuZnVuY3Rpb24gdHJpbVRleHQoKXtcbiAgICB2YXIgZGVzY3JpcHRpb25zID0gJChcImJvZHlcIikuZmluZChcIi5TVUlfVFJJTU1BQkxFXCIpO1xuICAgIC8vY29uc29sZS5sb2coZGVzY3JpcHRpb25zKTtcbiAgICBmdW5jdGlvbiB0cmltKGluZGV4LCB0ZXh0KXtcbiAgICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFxXKlxccyhcXFMpKiQvLCAnLi4uJyk7XG4gICAgfVxuICAgIGZvcih2YXIgaT0wOyBpPGRlc2NyaXB0aW9ucy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHZhciBwID0galF1ZXJ5KGRlc2NyaXB0aW9uc1tpXSkuZmluZChcIi5TVUlfVkFNSURETEVfVEVYVFdSQVBQRVJfSU5ORVJURVhUXCIpO1xuICAgICAgICB2YXIgZGl2aCA9IGpRdWVyeShkZXNjcmlwdGlvbnNbaV0pLmhlaWdodCgpO1xuICAgICAgICB3aGlsZSAoJChwKS5vdXRlckhlaWdodCgpPmRpdmgpIHtcbiAgICAgICAgICAgICQocCkudGV4dCh0cmltKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhkZXNjcmlwdGlvbnNbaV0pO1xuICAgIH1cbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vLy8gU1VJIENIRUNLQk9YXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgXCIuU1VJX0NIRUNLQk9YXCIsIGZ1bmN0aW9uKGUpe1xuICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG4gICAgaWYoJHRoaXMuaGFzQ2xhc3MoJ0RJU0FCTEVELUlOUFVUJykpe1xuICAgICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJHRoaXMudG9nZ2xlQ2xhc3MoJ0NIRUNLRUQnKTtcbiAgICAgICAgJHRoaXMudG9nZ2xlQ2xhc3MoJ1VOQ0hFQ0tFRCcpO1xuICAgICAgICAkdGhpcy5maW5kKFwiLlNVSV9WQU1JRERMRV9URVhUV1JBUFBFUl9JTk5FUlRFWFRcIikudG9nZ2xlQ2xhc3MoJ2ljb24tY2hlY2stMicpO1xuICAgIH1cbn0pO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLyBTVUkgUkFESU9CVVRUT05cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5TVUlfUkFESU9CVVRUT05cIiwgZnVuY3Rpb24oZSl7XG4gICAgdmFyICR0aGlzID0gJCh0aGlzKTtcbiAgICBpZigkdGhpcy5oYXNDbGFzcygnRElTQUJMRUQtSU5QVVQnKSl7XG4gICAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkdGhpcy50b2dnbGVDbGFzcygnQ0hFQ0tFRCcpO1xuICAgICAgICAkdGhpcy50b2dnbGVDbGFzcygnVU5DSEVDS0VEJyk7XG4gICAgICAgICR0aGlzLmZpbmQoXCIuU1VJX1ZBTUlERExFX1RFWFRXUkFQUEVSX0lOTkVSVEVYVFwiKS50b2dnbGVDbGFzcygnaWNvbi1yYWRpby1idXR0b24tY2lyY2xlJyk7XG4gICAgfVxufSk7XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLyBTVUkgVE9HR0xFXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5TVUlfVE9HR0xFXCIsIGZ1bmN0aW9uKGUpe1xuICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG4gICAgaWYoJHRoaXMuaGFzQ2xhc3MoJ0RJU0FCTEVELUlOUFVUJykpe1xuICAgICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJHRoaXMudG9nZ2xlQ2xhc3MoJ1RPR0dMRV9PTicpO1xuICAgICAgICAkdGhpcy50b2dnbGVDbGFzcygnVE9HR0xFX09GRicpO1xuICAgIH1cbn0pO1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vLy8gU1VJIERST1BET1dOXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbnZhciAkYWN0aXZlU3VpT3B0aW9uQnV0dG9uO1xuXG4kKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIFwiLlNVSV9PUFRJT05TX0JVVFRPTlwiLCBmdW5jdGlvbihlKXtcbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuICAgIHZhciAkcGFyZW50ID0gJHRoaXMucGFyZW50KCk7XG4gICAgaWYoJHBhcmVudC5oYXNDbGFzcyhcIkFDVElWRV9TVUlfT1BUSU9OU19EUk9QRE9XTlwiKSl7XG4gICAgICAgICRwYXJlbnQucmVtb3ZlQ2xhc3MoXCJBQ1RJVkVfU1VJX09QVElPTlNfRFJPUERPV05cIik7XG4gICAgICAgICRhY3RpdmVTdWlPcHRpb25CdXR0b24gPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKCRhY3RpdmVTdWlPcHRpb25CdXR0b24pe1xuICAgICAgICAgICAgJGFjdGl2ZVN1aU9wdGlvbkJ1dHRvbi5yZW1vdmVDbGFzcyhcIkFDVElWRV9TVUlfT1BUSU9OU19EUk9QRE9XTlwiKTtcbiAgICAgICAgfVxuICAgICAgICAkcGFyZW50LmFkZENsYXNzKFwiQUNUSVZFX1NVSV9PUFRJT05TX0RST1BET1dOXCIpO1xuICAgICAgICAkYWN0aXZlU3VpT3B0aW9uQnV0dG9uID0gJHBhcmVudDtcbiAgICB9XG59KTtcblxuJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5TVUlfT1BUSU9OU19EUk9QRE9XTl9PUFRJT05cIiwgZnVuY3Rpb24oZSl7XG4gICAgdmFyICR0aGlzID0gJCh0aGlzKTtcbiAgICAkdGhpcy5wYXJlbnQoKS5maW5kKFwiLlNVSV9PUFRJT05TX0RST1BET1dOX09QVElPTlwiKS5yZW1vdmVDbGFzcyhcIlNFTEVDVEVEX0RST1BET1dOX09QVElPTlwiKTtcbiAgICAkdGhpcy5hZGRDbGFzcyhcIlNFTEVDVEVEX0RST1BET1dOX09QVElPTlwiKTtcbiAgICB2YXIgJHdyYXAgPSAkdGhpcy5wYXJlbnQoKS5wYXJlbnQoKTtcbiAgICB2YXIgJHN0YXR1cyA9ICR0aGlzLmZpcnN0KCkuZmlyc3QoKTtcbiAgICB2YXIgJGFjdGl2ZVN0YXR1cyA9ICgkdGhpcy5wYXJlbnQoKS5wYXJlbnQoKSkuZmluZChcIi5TVUlfT1BUSU9OU19CVVRUT05fVEVYVFwiKTtcbiAgICAkYWN0aXZlU3RhdHVzLnRleHQoJHN0YXR1cy50ZXh0KCkpO1xuICAgICR3cmFwLnJlbW92ZUNsYXNzKFwiQUNUSVZFX1NVSV9PUFRJT05TX0RST1BET1dOXCIpO1xuICAgICR3cmFwLmFkZENsYXNzKFwiU0VMRUNURURfU1VJX09QVElPTlNfRFJPUERPV05cIik7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAkd3JhcC5yZW1vdmVDbGFzcyhcIlNFTEVDVEVEX1NVSV9PUFRJT05TX0RST1BET1dOXCIpO1xuICAgIH0sMTAwKTtcbn0pO1xuXG5cbiQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgXCIuU1VJX1NFQ09OREFSWV9PUFRJT05cIiwgZnVuY3Rpb24oZSl7XG4gICAgdmFyICR0aGlzID0gJCh0aGlzKTtcbiAgICAkdGhpcy50b2dnbGVDbGFzcygnU2VsZWN0ZWRfT3B0aW9uJyk7XG4gICAgdmFyICRvcHRpb25DaGVja2JveCA9ICR0aGlzLmZpbmQoJy5TVUlfQ0hFQ0tCT1gnKTtcbiAgICAkb3B0aW9uQ2hlY2tib3gudG9nZ2xlQ2xhc3MoJ0NIRUNLRUQnKTtcbiAgICAkb3B0aW9uQ2hlY2tib3gudG9nZ2xlQ2xhc3MoJ1VOQ0hFQ0tFRCcpO1xuICAgICRvcHRpb25DaGVja2JveC5maW5kKFwiLlNVSV9WQU1JRERMRV9URVhUV1JBUFBFUl9JTk5FUlRFWFRcIikudG9nZ2xlQ2xhc3MoJ2ljb24tY2hlY2stMicpO1xuICAgIGlmKCR0aGlzLmhhc0NsYXNzKCdTZWxlY3RlZF9PcHRpb24nKSAmJiAkb3B0aW9uQ2hlY2tib3guaGFzQ2xhc3MoJ1VOQ0hFQ0tFRCcpKXtcbiAgICAkb3B0aW9uQ2hlY2tib3gudG9nZ2xlQ2xhc3MoJ0NIRUNLRUQnKTtcbiAgICAkb3B0aW9uQ2hlY2tib3gudG9nZ2xlQ2xhc3MoJ1VOQ0hFQ0tFRCcpO1xuICAgICRvcHRpb25DaGVja2JveC5maW5kKFwiLlNVSV9WQU1JRERMRV9URVhUV1JBUFBFUl9JTk5FUlRFWFRcIikudG9nZ2xlQ2xhc3MoJ2ljb24tY2hlY2stMicpO1xuICAgIH1cbiAgICBpZighJHRoaXMuaGFzQ2xhc3MoJ1NlbGVjdGVkX09wdGlvbicpICYmICRvcHRpb25DaGVja2JveC5oYXNDbGFzcygnQ0hFQ0tFRCcpKXtcbiAgICAkb3B0aW9uQ2hlY2tib3gudG9nZ2xlQ2xhc3MoJ0NIRUNLRUQnKTtcbiAgICAkb3B0aW9uQ2hlY2tib3gudG9nZ2xlQ2xhc3MoJ1VOQ0hFQ0tFRCcpO1xuICAgICRvcHRpb25DaGVja2JveC5maW5kKFwiLlNVSV9WQU1JRERMRV9URVhUV1JBUFBFUl9JTk5FUlRFWFRcIikudG9nZ2xlQ2xhc3MoJ2ljb24tY2hlY2stMicpO1xuICAgIH1cbn0pO1xuXG5cbiQoXCJib2R5XCIpLm9uKFwiY2xpY2tcIiwgXCIuU1VJX1JBRElPX09QVElPTlwiLCBmdW5jdGlvbihlKXtcbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuICAgIHZhciB0aGlzSXNTZWxlY3RlZCA9ICR0aGlzLmhhc0NsYXNzKCdTZWxlY3RlZF9PcHRpb24nKTtcbiAgICB2YXIgJHBhcmVudCA9ICR0aGlzLmNsb3Nlc3QoXCIuU1VJX1JBRElPX09QVElPTlNcIik7XG4gICAgdmFyICRzZWxlY3RlZE9wdGlvbiA9ICRwYXJlbnQuZmluZCgnLlNlbGVjdGVkX09wdGlvbicpO1xuICAgIGlmKCRzZWxlY3RlZE9wdGlvbil7XG4gICAgICAgICRzZWxlY3RlZE9wdGlvbi5yZW1vdmVDbGFzcygnU2VsZWN0ZWRfT3B0aW9uJyk7XG4gICAgICAgIHZhciAkc2VsZWN0ZWRPcHRpb25SYWRpb0J1dHRvbiA9ICRzZWxlY3RlZE9wdGlvbi5maW5kKCcuU1VJX1JBRElPQlVUVE9OJyk7XG4gICAgICAgICRzZWxlY3RlZE9wdGlvblJhZGlvQnV0dG9uLnJlbW92ZUNsYXNzKCdDSEVDS0VEJyk7XG4gICAgICAgICRzZWxlY3RlZE9wdGlvblJhZGlvQnV0dG9uLmFkZENsYXNzKCdVTkNIRUNLRUQnKTtcbiAgICAgICAgJHNlbGVjdGVkT3B0aW9uUmFkaW9CdXR0b24uZmluZChcIi5TVUlfVkFNSURETEVfVEVYVFdSQVBQRVJfSU5ORVJURVhUXCIpLnJlbW92ZUNsYXNzKCdpY29uLXJhZGlvLWJ1dHRvbi1jaXJjbGUnKTtcbiAgICB9XG4gICAgJHRoaXMuYWRkQ2xhc3MoJ1NlbGVjdGVkX09wdGlvbicpO1xuICAgIHZhciAkdGhpc1JhZGlvQnV0dG9uID0gJHRoaXMuZmluZCgnLlNVSV9SQURJT0JVVFRPTicpO1xuICAgICR0aGlzUmFkaW9CdXR0b24ucmVtb3ZlQ2xhc3MoJ1VOQ0hFQ0tFRCcpO1xuICAgICR0aGlzUmFkaW9CdXR0b24uYWRkQ2xhc3MoJ0NIRUNLRUQnKTtcbiAgICAkdGhpc1JhZGlvQnV0dG9uLmZpbmQoXCIuU1VJX1ZBTUlERExFX1RFWFRXUkFQUEVSX0lOTkVSVEVYVFwiKS5hZGRDbGFzcygnaWNvbi1yYWRpby1idXR0b24tY2lyY2xlJyk7XG59KTtcblxuXG4kKFwiYm9keVwiKS5vbihcImNsaWNrXCIsIFwiI2ludGVyY29tLWNsb3NlLWJ1dHRvblwiLCBmdW5jdGlvbihlKXtcbiAgICAkKCcjaW50ZXJjb20tZGVtbycpLmFkZENsYXNzKCdTVUlfSElERScpO1xufSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vLy8gSU5URVJDT01cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXG5cbiQod2luZG93KS5sb2FkKGZ1bmN0aW9uKCl7XG4gICAgdHJpbVRleHQoKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJyNpbnRlcmNvbS1kZW1vJykucmVtb3ZlQ2xhc3MoJ1NVSV9ISURFJyk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgXG4gICAgICAgICAgICAkKCcjaW50ZXJjb20tcHJvZmlsZS1waWMnKS5yZW1vdmVDbGFzcygnaW5pdGlhbC1pbnRlcmNvbS1wcm9maWxlLXBpYycpO1xuICAgICAgICB9LCA1MDApO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IFxuICAgICAgICAgICAgJCgnI2ludGVyY29tLXByb2ZpbGUtcGljJykuYXR0cignc3JjJywgJy9pbWFnZXMvaW50ZXJjb20tcHJvZmlsZS5wbmcnKTtcbiAgICAgICAgfSwgMTUwMCk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgXG4gICAgICAgICAgICAkKCcjaW50ZXJjb20tcHJvZmlsZS1ub3RpZmljYXRpb24nKS5yZW1vdmVDbGFzcygnU1VJX0hJREUnKTtcbiAgICAgICAgICAgICQoJyNpbnRlcmNvbS1jb21tZW50JykucmVtb3ZlQ2xhc3MoJ1NVSV9ISURFJyk7XG4gICAgICAgIH0sIDIwMDApO1xuICAgIH0sICgoTWF0aC5yYW5kb20oKSsxKSoxMDAwKSlcbn0pO1xuXG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLyBmb3Igc3R5bGl6ZWQgY2hlY2ttYXJrc1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAkKCdpbnB1dCcpLmlDaGVjayh7XG4gICAgICAgIGNoZWNrYm94Q2xhc3M6ICdpY2hlY2tib3hfbWluaW1hbC1TVUknLFxuICAgICAgICByYWRpb0NsYXNzOiAnaXJhZGlvX21pbmltYWwtU1VJJyxcbiAgICAgICAgaW5jcmVhc2VBcmVhOiAnMjAlJyAvLyBvcHRpb25hbFxuICAgICAgfSk7XG4gICAgfSk7XG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLyBTVUkgQ0hFQ0tCT1hcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuJChcImJvZHlcIikub24oXCJjbGlja1wiLCBcIi5TVUlfTU9EQUxfQ0xPU0VSXCIsIGZ1bmN0aW9uKGUpe1xuICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG4gICAgJHRoaXMuY2xvc2VzdChcIi5TVUlfTU9EQUxcIikuYWRkQ2xhc3MoXCJTVUlfSElERVwiKTtcbn0pO1xuXG4iXSwiZmlsZSI6Imdsb2JhbC1sYXlvdXQuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==