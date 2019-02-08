$(function() {
    $(document).on('click', '[data-modal]', function() {
        var modal = $(this).data('modal');
        var $modal = $(modal);
        $modal.data('content', $(this).data('content'));
        $modal.toggleClass('hidden', false);
        $modal.trigger('openModal');
    });

    $('.modal .close').on('click', function() {
        $(this).closest('.modal').trigger('close');
    });

    $('.modal').on('click', function(event) {
        if(event.toElement == this)
            $(this).trigger('close');
    });

    $('.modal').on('close', function() {
        var $modal = $(this);
        $modal.toggleClass('hidden', true);
        $modal.trigger('closeModal');
    });

    $('.modal').on('open', function() {
        var $modal = $(this);
        $modal.toggleClass('hidden', false);
        $modal.trigger('openModal');
    });
});


$('#dealCmd_modal').on('openModal', function() {
    var player = parseInt($(this).data('content'));
    $cmd = $(this).find('ul.cmdDamage');
    $cmd.find('li:not(.template)').remove();
    for (var j = 0; j < game.data.players.length; j++) {
        if (player != j) {
            $dmg = $cmd.find('.template').clone();
            $dmg.toggleClass('template', false);
            $dmg.find('h2').text(game.data.playerNames[j]);
            $dmg.find('.num').text(game.data.players[player].commander_damage[j]);
            $dmg.find('button').data('dmg', j);
            $dmg.css({ background: game.data.players[j].color, color: 'black' });
            $dmg.appendTo($cmd);
        }
    }
    $(this).find('.infect .num').text(game.data.players[player].infect);
    $(this).find('button').data('player', player);
});

$('#dealCmd_modal').on('click', 'button.toggle_cmd', function() {
    $(this).closest('.modal').find('.cmdDamage').toggleClass('hidden', false);
    $(this).closest('.modal').find('.infect').toggleClass('hidden', true);
});

$('#dealCmd_modal').on('click', 'button.toggle_infect', function() {
    $(this).closest('.modal').find('.cmdDamage').toggleClass('hidden', true);
    $(this).closest('.modal').find('.infect').toggleClass('hidden', false);
});

$('#dealCmd_modal').on('click', '.cmdDamage button.pluss', function() {
    var p = parseInt($(this).data('player'));
    var dmg = parseInt($(this).data('dmg'));
    game.data.players[p].commander_damage[dmg]++;
    $(this).closest('li').find('.num').text(game.data.players[p].commander_damage[dmg]);
    game.render();
    game.save();
});

$('#dealCmd_modal').on('click', '.cmdDamage button.minus', function() {
    var p = parseInt($(this).data('player'));
    var dmg = parseInt($(this).data('dmg'));
    game.data.players[p].commander_damage[dmg]--;
    $(this).closest('li').find('.num').text(game.data.players[p].commander_damage[dmg]);
    game.render();
    game.save();
});

$('#dealCmd_modal').on('click', '.infect button.pluss', function() {
    var p = parseInt($(this).data('player'));
    game.data.players[p].infect++;
    $(this).closest('li').find('.num').text(game.data.players[p].infect);
    game.render();
    game.save();
});

$('#dealCmd_modal').on('click', '.infect button.minus', function() {
    var p = parseInt($(this).data('player'));
    game.data.players[p].infect--;
    $(this).closest('li').find('.num').text(game.data.players[p].infect);
    game.render();
    game.save();
});

$('#menu_modal .reset').on('click', function() { game.reset(); });


$('#change_names_modal').on('openModal', function() {
    $list = $(this).find('ul');
    $list.find('li:not(.template)').remove();
    for (var j = 0; j < game.data.playerNames.length; j++) {
        $dmg = $list.find('.template').clone();
        $dmg.toggleClass('template', false);
        $dmg.find('span').text('Player #' + (j+1));
        $dmg.find('input').val(game.data.playerNames[j]);
        $dmg.appendTo($list);
    }
});
$('#change_names_modal .save').on('click', function() { 
    game.data.playerNames = [];
    $(this).closest('.modal').find('ul li:not(.template) input').each(function() {
        game.data.playerNames.push($(this).val());
    });
    $('.modal').trigger('close');
    game.save();
    game.render(); 
});

