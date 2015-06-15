jQuery.fn.endlessRiver = function (settings) {
    settings = jQuery.extend({
        speed: 100,
		pause: true,
		buttons: false
    }, settings);
    return this.each(function(){
		var j = jQuery;
        var $line = j(this);
		$line.css({
			margin: "0 !important",
			padding: "0 !important"
		});
        var currentSpazio,currentTempo;
        var initialOffset = $line.offset().left;
		var lineWidth = 1;
        $line.children("li.tick-clones").remove();
		//elimina cloni se ci sono - Serve in caso io aggiorni dinamicamente il contenuto
        $line.addClass("newsticker");
        var $mask = $line.wrap("<div class='mask'></div>");
        var $tickercontainer = $line.parent().wrap("<div class='tickercontainer'></div>");
		var elements = $line.children("li");
		var fill = function(){
			lineWidth = 1;
			$line.append(elements.clone(true).addClass("tick-clones"));
			$line.children("li").each(function (i) {
				lineWidth += j(this, i).outerWidth(true);
				//outherWidth con argomento true ritorna larghezza compresi margini
			});
			
		}
		while(lineWidth<$tickercontainer.outerWidth(true)) fill();
		$line.width(lineWidth);
        $line.height($line.parent().height());
        function scrollnews(spazio, tempo) {
            $line.animate({left: '-=' + spazio}, tempo, "linear", function () {
                $line.children("li:first").appendTo($line);
                $line.css("left", 0);
                currentSpazio = $line.children("li:first").outerWidth(true);
                currentTempo = tempo / spazio * currentSpazio;
                scrollnews(currentSpazio, currentTempo);
            });
        }
        currentSpazio = $line.children("li:first").outerWidth(true);
        currentTempo = currentSpazio / settings.speed * 1000;
        //x 1000 perchè tempo è in millisecondi
        scrollnews(currentSpazio, currentTempo);
		function setHover(){
			$line.hover(function () {
				j(this).stop();
			},
			function () {
				var offset = $line.offset().left;
				var residualSpace = offset + $line.children("li:first").outerWidth(true) - initialOffset;
				var residualTime = currentTempo / currentSpazio * residualSpace;
				scrollnews(residualSpace, residualTime);
			});
		}
		if(settings.pause) setHover();
		
		if(settings.buttons){
			var $buttons = j('<ul class="er-controls">'+
			'<li class="pause">pause</li>'+
			'<li class="play">play</li>'+
			'</ul>');
			$buttons.insertAfter($tickercontainer);
			$buttons.children(".pause").click(function(){
				$line.unbind('mouseenter mouseleave');
				$line.stop();
			});
			$buttons.children(".play").click(function(){
				setHover();
				var offset = $line.offset().left;
				var residualSpace = offset + $line.children("li:first").outerWidth(true) - initialOffset;
				var residualTime = currentTempo / currentSpazio * residualSpace;
				scrollnews(residualSpace, residualTime);
			});		
		}
			
    });
};