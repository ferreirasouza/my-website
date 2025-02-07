var s,
    app = {

    settings : {
        textFadeSpeed: 2000 // How fast to rotate text on the homepage
    },
    init: function() {
        //Global settings
        s = this.settings;

        //initalize
        this.initalizers();
        this.bindUiActions();
        this.editNavigation();
        this.mailChimpAjax();
        this.keepSettings();

        //Settings -> can be removed in your production code and change any on click actions into the keep settings function
        this.settingOptions();
    },

    bindUiActions: function (){

        var self = this;

        // A button click on the home page - triggers a click on the menu with slides the site down
        $('.take-a-look').on('click', function () {
            $('.onepage-pagination li:nth-child(2) > a').trigger('click');
        });

        $(document).on('slidemove', function() {
            // slidemove is custom event fired when moving between slides
            self.animateSlides();
        });
    },

    initalizers: function(){

        //initalize onepage scroll
        $(".main").onepage_scroll({
            sectionContainer: "section"
        });

        // Wait until video has loaded before fading it in.
        $(window).load( function(){
            $('#big-video-wrap').show().animate({opacity:1});
        });

        // Text slider on homepage turn on rotation
        $(".demo1 .rotate").textrotator({
            animation: "fade",
            speed: s.textFadeSpeed
        });

    },
    bigVideo : function() {

        //initalize big video
        var BV = new $.BigVideo({
                useFlashForFirefox: false
            });

        BV.init();

        if(Modernizr.touch){
            BV.show("img/background.jpg");
        }else{
            BV.show("video/background-video.mp4",{
                ambient: true,
                doLoop: true,
                altSource: "video/background-video.ogv"
            });
        }
    },
    editNavigation : function() {

        $('.onepage-pagination').addClass("animated fadeInRight delay-3");

        $('.onepage-pagination').children().each( function() {

            switch ($(this).children().data('index')) {
                case 1 :
                    $(this).children().append("<i class='fa fa-home'></i>");
                break;
                case 2 :
                    $(this).children().append("<i class='fa fa-dot-circle-o'></i>");
                break;
                case 3 :
                    $(this).children().append("<i class='fa fa-diamond'></i>");
                break;
                case 4 :
                    $(this).children().append("<i class='fa fa-ellipsis-h'></i>");
                break;
                case 5 :
                    $(this).children().append("<i class='fa fa-paper-plane'></i>");
                break;
            }
        });
    },
    animateSlides : function() {
        // use .delay - each step is 500ms
        // 1 equals 500ms
        // 2 equals 1000s
        // 3 equals 1500ms etc

        if ( this.isSlide(2) ) {

            $('.slide-1-title').removeClass('hide').addClass('animated fadeInRight delay-1');
            $('.slide-1-1').removeClass('hide').addClass('animated fadeInRight delay-3');
            $('.iphone-1').removeClass('hide').addClass('animated fadeInUp delay-3');
            $('.slide-1-2').removeClass('hide').addClass('animated fadeInDown delay-5');
            $('.slide-1-3').removeClass('hide').addClass('animated fadeInDown delay-6');
            $('.slide-1-scroll').removeClass('hide').addClass('animated fadeInDown delay-12');

            $('.icon span').css("color", "#fff");

        } else if ( this.isSlide(3)) {

            $('.iphone-2').removeClass('hide').addClass('animated fadeInDown delay-1');
            $('.slide-2-title').removeClass('hide').addClass('animated fadeIn delay-3');
            $('.slide-2-1').removeClass('hide').addClass('animated fadeIn delay-4');
            $('.slide-2-2').removeClass('hide').addClass('animated fadeInDown delay-5');
            $('.slide-2-3').removeClass('hide').addClass('animated fadeInDown delay-6');
            $('.slide-2-4').removeClass('hide').addClass('animated fadeInDown delay-9');
            $('.slide-2-5').removeClass('hide').addClass('animated fadeInDown delay-10');
            $('.slide-2-6').removeClass('hide').addClass('animated fadeInDown delay-11');
            $('.slide-2-scroll').removeClass('hide').addClass('animated fadeInDown delay-15');

            $('.icon span').css("color", "#fff");

        } else if ( this.isSlide(4) ) {

            $('.slide-3-title').removeClass('hide').addClass('animated fadeInLeft delay-1');
            $('.slide-3-1').removeClass('hide').addClass('animated fadeInLeft delay-3');
            $('.iphone-3').removeClass('hide').addClass('animated fadeInUp delay-3');
            $('.slide-3-2').removeClass('hide').addClass('animated fadeInDown delay-5');
            $('.slide-3-3').removeClass('hide').addClass('animated fadeInDown delay-6');
            $('.slide-3-scroll').removeClass('hide').addClass('animated fadeInDown delay-12');

            $('.icon span').css("color", "#333");

        } else if ( this.isSlide(5) ) {
            $('.icon span').css("color", "#fff");
        }
    },
    isSlide: function(slide) {
        if( $( "body" ).hasClass( "viewing-page-" +  slide ) ){
            return true;
        } else {
            return false;
        }
    },
    settingOptions : function() {

        $('.settings-icon').on('click', function () {
            $(this).parent().toggleClass("open");
        });

        $('.toggle-video').on('click', function() {
            $('#big-video-wrap').toggleClass('hide-video');
        });

        $('.toggle-opacity-first').on('click', function() {
            $('.home').toggleClass('full-color');
        });

        $('.toggle-opacity-all').on('click', function() {
            $('.home, .slide-1, .slide-2, .slide-3, .contact').toggleClass('full-color');

        });

        $('.toggle-phone').on('click', function() {
            $('.home-phone').toggleClass('hide animated fadeIn');
            $('.home-copy').toggleClass('col-sm-8 col-sm-offset-2 col-sm-6');
        });

    },
    keepSettings: function(){
        // If you want to use setting in production move the code within the click events above into this function fot example.
        //  Example - for setting the Phone on the home screen by default use below from the  clicking on toggle-phone.

        // $('.home-phone').toggleClass('hide animated fadeIn');
        // $('.home-copy').toggleClass('col-sm-8 col-sm-offset-2 col-sm-6');
    },

    mailChimpAjax: function() {

    var self = this,
        mailForm = $('#mc-embedded-subscribe-form');

        $('#mc-embedded-subscribe-form button[type="submit"]').bind('click', function ( event ) {
            event.preventDefault();
            self.register(mailForm);
        });

    },
    register: function(form){
        var $message = form.parent().siblings('.sign-up-message');

        $.ajax({
            type: form.attr('method'),
            url: form.attr('action'),
            data: form.serialize(),
            cache       : false,
            dataType    : 'json',
            contentType: "application/json; charset=utf-8",
            error       : function(err) {
                console.log(" Could not connect to the registration server. Please try again later. ", err);
                $message.text('There was an error submitting your email, please try again').removeClass('hidden').addClass(' error animated fadeInDown');
            },
            success     : function(data) {
                console.log("success");
                if (data.result != "success") {

                    $message.text('There was an error submitting your email, please try again').removeClass('hidden').addClass(' error animated fadeInDown');

                } else {
                    $message.html('Thank you. Your email was successfully submitted');
                    $message.removeClass('hidden').addClass(' animated fadeInDown');
                }
            }
        });//end ajax
    }// end register
};

$(document).ready(function(){
    app.init();
});
