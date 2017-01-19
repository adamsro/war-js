import React from 'react';
import ReactDOM from 'react-dom';
import {WarApp} from './app';
import {WarGame, CardDeck} from './war';

const game = new WarGame();
const deck = new CardDeck();
game.startGame(deck);

function render() {
  ReactDOM.render(
    <WarApp game={game} />,
    document.getElementById('root')
  );
}
game.subscribe(render);
render();
