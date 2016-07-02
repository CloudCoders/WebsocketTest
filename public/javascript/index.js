$(function() {
	var master = false;

    // socket definitions and handlers
    var socket = io.connect(window.location.host);
    socket.on('connect', function(){
        console.log('connected');
        socket.send({action: 'join', game_id: 1 });
    });
    socket.on('disconnect', function(){
        console.log('disconnected');
    });

    socket.on('message', function(data) {
		console.log(data);
		switch (data.action) {
		case 'joined':
			handleJoined(data);
			break;
		case 'answer':
			handleAnswer(data);
			break;
		case 'someone_buzzed':
			handleSomeoneBuzzed(data);
			break;
		case 'you_buzzed':
			handleYouBuzzed(data);
			break;
		case 'time_up':
			handleTimeUp();
			break;
        case 'new_question':
            handleNewQuestion(data);
            break;
		case 'identification':
			handleIdentification(data);
			break;
		case 'idNotification':
			if(master)
				handleIdNotification(data);
			break;
		case 'player_left':
			handleLeave(data);
			break;
		default:
			break;
		}
    });

	var handleSomeoneBuzzed = function(data) {
		console.log(data.id + " buzzed in");
		$("#buzz_btn").attr('disabled', true);
        return false;
	};

	var handleYouBuzzed = function(data) {
		console.log('you buzzed');
		$("#buzz_btn").attr('disabled', true);
	};

	var handleAnswer = function(data) {
		$("#buzz_btn").removeAttr('disabled');
		console.log(data.answer + " was " +
					(data.correct ? "correct" : "incorrect"));
	};

	var handleTimeUp = function() {
		$("#buzz_btn").removeAttr('disabled');
		console.log("Time's up! Counted as incorrect");
	}

	var handleJoined = function(data) {
		console.log(data.id + " joined the game");
		if(master) {
			$("#player_list").append(`<li id='score_${data.id.substring(2)}'><h3>Jugador ${data.all.length-1}</h3></li>`);
		}
	};

	var handleLeave = function(data) {
		console.log(data.id + " left the game");
		if(master) {
			var id = data.id.substr(2);
			console.log('score_'+id);
			var elem = document.getElementById('score_'+id);
			elem.parentNode.removeChild(elem);
		} else {
			socket.emit('message', {action: 'requestNewID', game_id: 1});
		}
	};

	var handleIdentification = function(data) {
		if(data.id.length-1 != 0) {
			var id = data.id.length-1;
			$('#identification').html("<h3>Eres el jugador " + id + "</h3>");
			$('#identification').data('player',id);
			socket.emit('message', {
				action: 'notifyId',
				game_id: 1,
				id: id
			});
		} else {
			master = true;
			$('#buzz_btn').hide();
			if($('#identification').is(':empty'))
				$('#identification').html("<ul id='player_list'></ul>");
		}
	};

	var handleIdNotification = function(data) {
		var id = data.player.substr(2);
		var elem = document.getElementById('score_'+id);
		elem.innerHTML = `<h3>Jugador ${data.id}</h3>`;
	};

    var handleNewQuestion = function(data) {
		console.log("new question");
		var qhtml = `
			<h3>${data.question}</h3>
		`;
		var html = `
			<ul>
				<li><button type="button" class="answer_btn" id="A">${data.answers.a}</button></li>
				<li><button type="button" class="answer_btn" id="B">${data.answers.b}</button></li>
				<li><button type="button" class="answer_btn" id="C">${data.answers.c}</button></li>
				<li><button type="button" class="answer_btn" id="D">${data.answers.d}</button></li>
			</ul>
		`;
		document.getElementById('question').innerHTML = qhtml;
		document.getElementById('content').innerHTML = html;
    };


    // form handlers
    $('#buzz_btn').click(function() {
		socket.send({action: 'buzz', game_id: 1});
    });

	$('#content').on('click', '.answer_btn', function() {
		console.log(this.id);
		socket.send({
			action: 'answer',
		 	game_id: 1,
			value: this.id
		});
	});

    socket.connect();
});
