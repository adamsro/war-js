import React from 'react';
import ReactDOM from 'react-dom';
import {App, CardDeck, PlayingCard} from 'App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
it('Deck maintains 52 cards', () => {
  let deck = new CardDeck();
  expect(deck.drawCards(26).length).toBe(26);
  expect(deck.drawCards(26).length).toBe(26);
});