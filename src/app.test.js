import React from 'react';
import ReactDOM from 'react-dom';
import {PlayingCard, WarGame, CardStack, CardDeck} from './war';
import {WarApp} from './app';
/**
 * Created by adamsro on 1/18/17.
 */

it('renders without crashing', () => {
  const game = new WarGame();
  const deck = new CardDeck();
  game.startGame(deck);
  const div = document.createElement('div');
  ReactDOM.render(<WarApp game={game} />, div);
});
it('deck creates 52 cards', () => {
  let deck = new CardDeck();
  expect(deck.drawCards(26).length).toBe(26);
  expect(deck.drawCards(26).length).toBe(26);
  expect(deck.drawCards(26).length).toBe(0);
});
it('Stack addToBottom adds to bottom', () => {
  const card2 = new PlayingCard(2,'s');
  const card3 = new PlayingCard(3,'s');
  const card4 = new PlayingCard(4,'s');
  const card5 = new PlayingCard(5,'s');
  let stack = new CardStack([card2, card3, card4, card5]);
  stack.addToBottom([stack.drawCard()], [stack.drawCard()]);
  expect(stack.cards).toEqual([card5, card4, card2, card3]);
});
it('Compares 2 non-equal cards', () => {
  const card2 = new PlayingCard(2,'s');
  const card3 = new PlayingCard(3,'s');
  const war = new WarGame();
  war.startGame(new CardStack([card2, card3]));
  war.nextMove(); // cards on table
  war.nextMove(); // cards back in stacks
  expect(war.stackA.cards).toEqual([]);
  expect(war.stackB.cards).toEqual([card2, card3]);
});
