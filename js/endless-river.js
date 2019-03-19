jQuery.fn.endlessRiver = function (settings) {
    // Settings before everything else
    settings = jQuery.extend({
        speed: 100,
        pause: !0,
        buttons: !1
    }, settings);

    // Shared vars
    var $buttons = $('<ul class="er-controls">' +
        '<li class="prev glyphicon glyphicon-chevron-left"></li>' +
        '<li class="pause glyphicon glyphicon-pause"></li>' +
        '<li class="next glyphicon glyphicon-chevron-right"></li>' +
        '</ul>');
    var clonesClassName = "tick-clones";
    var event_pause = "click.erPause";
    var event_play = "click.erPlay";
    var event_prev = "click.erPrev";
    var event_next = "click.erNext";
    var events_mouse = "mouseenter mouseleave";
    var playBtnClassNames = "play glyphicon-play pause glyphicon-pause";
    var tickerClassName = "tickercontainer";

    // Utils
    var getFirstLi = function ($el) {
        return $el.children("li:first");
    };

    var getTime = function (space) {
        return space / settings.speed * 1000;
    };

    return this.each(function () {
        // Local reference to avoid conflicts
        var $ = jQuery;
        var $body = $("body");
        var $line = $(this);
        // Local vars
        var currentSpazio, currentTempo;
        var uniqueId = "ER_" + +new Date();
        var run = !0;
        //
        $line.wrap("<div id='" + uniqueId + "'></div>");
        $line.css({
            margin: "0 !important",
            padding: "0 !important"
        });
        var initialOffset = $line.offset().left;
        var lineWidth = 1;
        $line.children("li." + clonesClassName).remove();
        // elimina cloni se ci sono - Serve in caso io aggiorni dinamicamente il contenuto
        $line.addClass("newsticker");
        var $mask = $line.wrap("<div class='mask'></div>");
        var $tickerContainer = $line.parent().wrap("<div class='" + tickerClassName + "'></div>");
        var $liElements = $line.children("li");
        var fill = function () {
            lineWidth = 1;
            $line.append($liElements.clone(!0).addClass(clonesClassName));
            $line.children("li").each(function (i) {
                lineWidth += $(this, i).outerWidth(!0);
                // outerWidth con argomento !0 ritorna larghezza compresi margini
            });
        };

        var tickerOuterWidth = $tickerContainer.outerWidth(!0);
        while (lineWidth < tickerOuterWidth) {
            fill();
        }
        $line.width(lineWidth);
        $line.height($line.parent().height());

        function scrollContent(space, time) {
            $line.animate({left: '-=' + space}, time, "linear", function () {
                getFirstLi($line).appendTo($line);
                $line.css("left", 0);
                currentSpazio = getFirstLi($line).outerWidth(!0);
                currentTempo = time / space * currentSpazio;
                if (run) {
                    scrollContent(currentSpazio, currentTempo);
                }
            });
        }

        //BOOT
        currentSpazio = getFirstLi($line).outerWidth(!0);
        // Il tempo è in millisecondi, quindi moltiplico per mille
        currentTempo = currentSpazio / settings.speed * 1000;
        scrollContent(currentSpazio, currentTempo);

        function setHover() {
            $line.off(events_mouse);
            $line.hover(pause, resume);
        }

        function pause() {
            $("#" + uniqueId + " .er-controls > .pause").toggleClass(playBtnClassNames);
            run = !1;
            $line.stop();
        }

        function resume() {
            $("#" + uniqueId + " .er-controls > .play").toggleClass(playBtnClassNames);
            run = !0;
            var offset = $line.offset().left;
            var spaceLeft = offset + getFirstLi($line).outerWidth(!0) - initialOffset;
            var timeLeft = currentTempo / currentSpazio * spaceLeft;
            scrollContent(spaceLeft, timeLeft);
        }

        if (settings.pause) {
            setHover();
        }

        if (settings.buttons) {
            $buttons.insertAfter($tickerContainer);
            // Delegate is better!
            $body.on(event_pause, "#" + uniqueId + " .er-controls > .pause", function () {
                if (!run) return !1;
                $(this).toggleClass(playBtnClassNames);
                $line.off(events_mouse);
                run = !1;
            });
            // Delegate is better!
            $body.on(event_play, "#" + uniqueId + " .er-controls > .play", function () {
                if (run) return !1;
                $(this).toggleClass(playBtnClassNames);
                run = !0;
                setHover();
                var offset = $line.offset().left;
                var spaceLeft = offset + getFirstLi($line).outerWidth(!0) - initialOffset;
                var timeLeft = currentTempo / currentSpazio * spaceLeft;
                scrollContent(spaceLeft, timeLeft);
            });

            var moving = !1;

            $body.on(event_next, "#" + uniqueId + " .er-controls > .next", function () {
                if (run) {
                    $("#" + uniqueId + " .er-controls > .pause").toggleClass(playBtnClassNames);
                    run = !1;
                    return;
                }
                if (moving) {
                    return !1;
                }
                var space = getFirstLi($line).outerWidth(!0);
                moving = !0;
                $line.stop(!0, !0).animate({left: '-=' + space}, getTime(space), "linear", function () {
                    getFirstLi($line).appendTo($line);
                    $line.css("left", 0);
                    moving = !1;
                });

            });

            $body.on(event_prev, "#" + uniqueId + " .er-controls > .prev", function () {
                if (run) {
                    $("#" + uniqueId + " .er-controls > .pause").toggleClass(playBtnClassNames);
                    run = !1;
                    return;
                }
                if (moving) {
                    return !1;
                }
                var space = $line.children("li:last").outerWidth(!0);
                $line.css("left", "-" + space + "px");
                $line.children("li:last").prependTo($line);
                moving = !0;
                $line.stop(!0, !0).animate({left: '+=' + space}, getTime(space), "linear", function () {
                    moving = !1;
                });

            });
        }

    });
};
