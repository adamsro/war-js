/**
 * Created by adamsro on 1/18/17.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {WarGame, CardDeck} from './war';
import {WarApp} from './index';


it('renders without crashing', () => {
  // const game = new WarGame();
  // const deck = new CardDeck();
  // game.startGame(deck);
  // const div = document.createElement('div');
  // ReactDOM.render(<WarApp game={game} />, div);
});
it('Deck maintains 52 cards', () => {
  let deck = new CardDeck();
  expect(deck.drawCards(26).length).toBe(26);
  expect(deck.drawCards(26).length).toBe(26);
  expect(deck.drawCards(26).length).toBe(26);
});
