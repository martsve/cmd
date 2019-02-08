var gameData = function(key, defaultData) {
    var obj = {};
    
    var defaultBackgrounds = ['#000000', '#000000', '#000000', '#000000', '#000000', '#000000'];
    var defaultColors = ['#aaaa33', '#33aa33', '#aa3333', '#3333aa','purple', '#aaaaaa'];

    obj.data = {};
    obj.reset = function() { 
        window.localStorage.removeItem(key); 
        game.load();
        game.render();
    };
    obj.load = function() {
        var local = window.localStorage.getItem(key);
        if (local) {
            obj.data = JSON.parse(local);
        }
        else {
            obj.data = defaultData;
        }
        return obj.data;
    };

    obj.save = function() {
        window.localStorage.setItem(key, JSON.stringify(obj.data));
    };

    obj.start = function() {
        obj.data.init = true;
        obj.data.playerNames = obj.data.playerNames || [];
        obj.data.playerBackgrounds = obj.data.playerBackgrounds || [];
        obj.data.playerColors = obj.data.playerColors || [];

        for (var i = obj.data.playerNames.length; i < obj.data.startingPlayers; i++) {
            obj.data.playerNames[i] = "Player " + (i + 1);
        }
        
        for (var i = obj.data.playerBackgrounds.length; i < obj.data.startingPlayers; i++) {
            obj.data.playerBackgrounds[i] = defaultBackgrounds[i];
        }
                
        for (var i = obj.data.playerColors.length; i < obj.data.startingPlayers; i++) {
            obj.data.playerColors[i] = defaultColors[i];
        }

        obj.data.players = [];
        for (var i = 0; i < obj.data.startingPlayers; i++) {
            obj.data.players.push({
                color: obj.data.playerColors[i],
                background: obj.data.playerBackgrounds[i],
                life: obj.data.startingLife,
                commander_damage: Array(obj.data.startingPlayers).fill(0),
                infect: 0
            });
        }

        obj.render();
        game.save();
    };

    obj.render = function() {
        if (!obj.data.init) {
            obj.start();
            return;
        }

        var $list = $('#players');
        var playerCount = obj.data.players.length;
        for (var i = 2; i <= 6; i++) {
            $list.toggleClass('p' + i, false);
        }
        $list.toggleClass('p' + playerCount, true);
        $list.find('.player:not(.template)').remove();
        for (var i = 0; i < playerCount; i++) {
            var $div = $('.player.template').clone();
            $div.toggleClass('template', false);
            $div.data('player', i);
            $div.css({ background: obj.data.players[i].background, color: obj.data.players[i].color });
            $div.find('h1').text(obj.data.playerNames[i]);
            $div.find('h2').text(obj.data.players[i].life);
            $div.find('.dealCmd').data('content', i);          
            $cmd = $div.find('ul.cmdDamage');
            for (var j = 0; j < playerCount; j++) {
                if (i != j) {
                    $dmg = $cmd.find('.template').clone();
                    $dmg.toggleClass('template', false);
                    $dmg.text(obj.data.players[i].commander_damage[j]);
                    $dmg.css({ background: obj.data.players[j].color, color: 'black' });
                    $dmg.appendTo($cmd);
                }
            }

            if (obj.data.players[i].infect > 0) {
                $div.find('.infect h3').text(obj.data.players[i].infect);
                $div.find('.infect').toggleClass('hidden', false);
            }

            $div.appendTo($list);
        }
    };
    
    return obj;
};



var game = gameData('cmdr', {
    init: false,
    startingLife: 40,
    startingPlayers: 4,
    playerNames: [],
    playerBackgrounds: [],
    playerColors: [],
    players: [
        {
            color: '#33aaaa',
            background: '#113333',
            life: 40,
            commander_damage: [0,0,0,0],
            infect: 0
        }]
});

$('#new_game_modal').on('openModal', function() {
    $(this).find('input[name=num_players]').each(function() {
        if (parseInt($(this).val()) == game.data.startingPlayers) {
            $(this).prop("checked", true);
        }
    });
    $(this).find('input[name=num_life]').each(function() {
        if (parseInt($(this).val()) == game.data.startingLife) {
            $(this).prop("checked", true);
        }
    });
});

$('#new_game_modal').on('click', '.start', function() {
    var players = $("input[name='num_players']:checked").val();
    var life = $("input[name='num_life']:checked").val();
    game.data.startingPlayers = parseInt(players);
    game.data.startingLife = parseInt(life);
    game.start();
    $('.modal').trigger('close');
});

$('#players').on('click', '.player .pluss', function() {
    var p = parseInt($(this).closest('.player').data('player'));
    game.data.players[p].life++;
    $(this).closest('.player').find('.life h2').text(game.data.players[p].life);
    game.save();
});

$('#players').on('click', '.player .minus', function() {
    var p = parseInt($(this).closest('.player').data('player'));
    game.data.players[p].life--;
    $(this).closest('.player').find('.life h2').text(game.data.players[p].life);
    game.save();
});

$(function() {
    game.load();

    game.render();
});