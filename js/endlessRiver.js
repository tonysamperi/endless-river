jQuery.fn.endlessRiver = function (settings) {
    settings = jQuery.extend({
        speed: 100,
		pause: true,
		buttons: false
    }, settings);
    return this.each(function(){
		var j = jQuery;
        var $line = j(this);
        var id = "ER_"+ new Date().getTime();
        $line.wrap("<div id=\""+id+"\"></div>");
		$line.css({
			margin: "0 !important",
			padding: "0 !important"
		});
        var currentSpazio,currentTempo;
        var run = true;
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
		var l = $tickercontainer.outerWidth(true);
		while(lineWidth<l) fill();
		$line.width(lineWidth);
        $line.height($line.parent().height());
        function scrollnews(spazio, tempo) {
            $line.animate({left: '-=' + spazio}, tempo, "linear", function () {
                $line.children("li:first").appendTo($line);
                $line.css("left", 0);
                currentSpazio = $line.children("li:first").outerWidth(true);
                currentTempo = tempo / spazio * currentSpazio;
                if(run)
                	scrollnews(currentSpazio, currentTempo);
            });
        }
        //BOOT
        currentSpazio = $line.children("li:first").outerWidth(true);
        currentTempo = currentSpazio / settings.speed * 1000;
        //x 1000 perchè tempo è in millisecondi
        scrollnews(currentSpazio, currentTempo);
		function setHover(){
			$line.hover(pause,resume);
		}

		function pause(){
			run = false;
		}

		function resume() {
			run = true;
			var offset = $line.offset().left;
			var residualSpace = offset + $line.children("li:first").outerWidth(true) - initialOffset;
			var residualTime = currentTempo / currentSpazio * residualSpace;
			scrollnews(residualSpace, residualTime);
		}
		if(settings.pause) setHover();
		
		if(settings.buttons){
			var $buttons = j('<ul class="er-controls">'+
			'<li class="prev">prev</li>'+
			'<li class="pause">pause</li>'+
			'<li class="play">play</li>'+
			'<li class="next">next</li>'+
			'</ul>');
			$buttons.insertAfter($tickercontainer);
			//DELEGATE IS BETTER!
			$("body").on("click", "#"+id+" .er-controls > .pause", function(){
				if(!run) return false;
				$line.unbind('mouseenter mouseleave');
				run = false;
			});

			$("body").on("click", "#"+id+" .er-controls > .play", function(){
				if(run) return false;
				run = true;
				setHover();
				var offset = $line.offset().left;
				var residualSpace = offset + $line.children("li:first").outerWidth(true) - initialOffset;
				var residualTime = currentTempo / currentSpazio * residualSpace;
				scrollnews(residualSpace, residualTime);
			});
			
			$("body").on("click", "#"+id+" .er-controls > .next", function(){
				if(run){
					run = false;
					return;
				} 
				var spazio = $line.children("li:first").outerWidth(true);
        		var tempo = spazio / settings.speed * 1000;
				$line.stop().animate({left: '-=' + spazio}, tempo, "linear", function () {
                	$line.children("li:first").appendTo($line);
                	$line.css("left", 0);
            	});

            });

			$("body").on("click", "#"+id+" .er-controls > .prev", function(){
				if(run){	
					run = false;
					return;
				} 
				var spazio = $line.children("li:last").outerWidth(true);
				$line.css("left", "-"+spazio+"px");
				$line.children("li:last").prependTo($line);
        		var tempo = spazio / settings.speed * 1000;
				$line.stop().animate({left: '+=' + spazio}, tempo, "linear");
				
			});			
		}
			
    });
};