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
    // No jokers
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
    return this.deck.splice(0, numCards);
  }

  static compareCards(card1, card2) {

  }
}

function Card(props) {
  return (<div className="card-spot">
        {props.showBack &&
        <img className="card" src="/cards/back.svg"/>
        }
        {props.face &&
        <img className="card" src={"/cards/" + props.face.rank + props.face.suit + ".svg"}/>
        }
      </div>
  );
}

function PlayerStack(props) {
  if (props.clickHandle) {
    return (<div className="stack active" tabIndex="2" autoFocus="true" onClick={() => props.clickHandle()}>
          <Card showBack={props.playerCardCount !== 0}/>
          <p className="text-center">Player {props.player}<br /> {props.playerCardCount} cards remaining</p>
        </div>
    );
  } else {
    return (<div className="stack">
          <Card showBack={props.playerCardCount !== 0}/>
          <p className="text-center">Player {props.player}<br /> {props.playerCardCount} cards remaining</p>
        </div>
    );
  }
}

function GameControl(props) {
  return (
      <div className="war-game-control">
        <button onClick={() => props.clickHandle()}
                tabIndex="1">{props.status === IN_PROGRESS ? "restart" : "start"}</button>
      </div>
  );
}

class WarCardGame extends React.Component {

  constructor() {
    super();
    this.deck = new CardDeck();
    this.state = {
      status: NOT_STARTED,
      stackA: [],
      stackB: [],
      cardA: false,
      cardB: false,
      isWar: false,
    }
  }

  handleStartButton() {
    // New shuffled deck
    this.setState({
      status: IN_PROGRESS,
      stackA: this.deck.getCards(26),
      stackB: this.deck.getCards(26),
      cardA: false,
      cardB: false,
      isWar: false,
    });
  }

  handleNextPlayButtons() {
    const cardA = this.state.stackA.pop();
    const cardB = this.state.stackB.pop();
    this.setState({
      cardA: cardA,
      cardB: cardB,
    });
  }

  render() {
    return (
        <div className="war-game">
          <GameControl clickHandle={() => this.handleStartButton()} status={this.state.status}/>
          <div className="card-layout">
            <div className="card-col">
              <PlayerStack
                  clickHandle={() => this.handleNextPlayButtons()}
                  player={PLAYER_A}
                  playerCardCount={this.state.stackA.length}
              />
            </div>
            <div className="card-col">
              <Card face={this.state.cardA} />
              <Card showBack={this.state.isWar} />
            </div>
            <div className="card-col">
              <Card face={this.state.cardB} />
              <Card showBack={this.state.isWar} />
            </div>
            <div className="card-col">
              <PlayerStack
                  clickHandle={false}
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
