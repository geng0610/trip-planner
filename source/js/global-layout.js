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

