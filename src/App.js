import React, {Component} from 'react';
import _ from 'lodash'; //TODO heavy dependency for one function, shuffle

const NOT_STARTED = 0;
const IN_PROGRESS = 1;
const FINISHED = 2;

const PLAYER_A = "A";
const PLAYER_B = "B";

// The deck is divided evenly among the players, giving each a down stack.
export class Deck {
  constructor() {
    const RANKS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        SUITS = ['s', 'c', 'd', 'h'];
    this.deck = [];

    RANKS.forEach(function (rank) {
      SUITS.forEach(function (suit) {
        this.deck.push({rank, suit});
      }, this);
    }, this);
    this.deck = _.shuffle(this.deck);
  }

  getCards(numCards) {
    return this.deck.splice(numCards);
  }
}

function Card(props) {
  return (<div className="card-spot">
        {props.isBack &&
          <img class="card" src="/media/{props.rank}-{props.suit}.svg"/>
        }
        }</div>
  );
}
function PlayerStack(props) {
  return (
      <div>
        <div className="stack {props.input && active}" onClick={() => props.onClick()}>
          <Card />
        </div>
        <p className="text-center">Player {props.player}: {props.playerCards} cards remaining</p>
      </div>
  );
}

class WarCardGame extends React.Component {

  newGame() {
    // New shuffled deck
    const deck = new Deck();

    this.setState({
      stackA: deck.getCards(26),
      stackB: deck.getCards(26),
      status: IN_PROGRESS,
      isNext: PLAYER_A,
    });
  }

  render() {
    return (
        <div className="war-game">
          <div className="card-row">
            <PlayerStack/>
          </div>
          <div className="card-row">
            <Card isBack=true />
            <Card/>
          </div>
          <div className="card-row">
            <Card/>
            <Card/>
          </div>
          <div className="card-row">
            <PlayerStack/>
          </div>
          <p className="text-center">Player B: cards remaining</p>
        </div>
    );
  }
}

export default WarCardGame;
