import React, {Component} from 'react';
import _ from 'lodash'; //TODO heavy dependency for one function, shuffle

const NOT_STARTED = 0;
const IN_PROGRESS = 1;
const FINISHED = 2;

const PLAYER_A = "A";
const PLAYER_B = "B";

// The deck is divided evenly among the players, giving each a down stack.
export class CardDeck {
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
        }</div>
  );
}

function PlayerStack(props) {
  return (
      <div>
        <div className="stack {props.input && active}" onClick={props.clickHandle}>
          <Card />
        </div>
        <p className="text-center">Player {props.player}<br /> {props.playerCardCount} cards remaining</p>
      </div>
  );
}

function GameControl(props) {
  return (
      <div className="war-game-control">
        <button onClick={() => props.onClick()}>{props.status == IN_PROGRESS ? "restart" : "start"}</button>
      </div>
  );
}

class WarCardGame extends React.Component {

  constructor() {
    super();
    this.state = {
      status: NOT_STARTED,
      stackA: [],
      stackB: []
    }
  }

  handleStartButton() {
    // New shuffled deck
    const deck = new CardDeck();

    this.setState({
      stackA: deck.getCards(26),
      stackB: deck.getCards(26),
      status: IN_PROGRESS,
      isNext: PLAYER_A,
    });
  }

  handleNextPlayButtons() {
    this.setState({});
  }

  render() {
    return (
        <div className="war-game">
          <GameControl onClick={() => this.handleStartButton()} status={this.state.status}/>
          <div className="card-layout">
            <div className="card-col">
              <PlayerStack
                  clickHandle={this.handleNextPlayButtons}
                  player={PLAYER_A}
                  playerCardCount={this.state.stackA.length}
              />
            </div>
            <div className="card-col">
              <Card/>
              <Card/>
            </div>
            <div className="card-col">
              <Card/>
              <Card/>
            </div>
            <div className="card-col">
              <PlayerStack
                  clickHandle={this.handleNextPlayButtons}
                  player={PLAYER_B}
                  playerCardCount={this.state.stackB.length}
              />
            </div>
          </div>
        </div>
    );
  }
}

export default WarCardGame;
