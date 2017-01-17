import React, {Component} from 'react';


const NOT_STARTED = 0;
const READY = 1;
const CARDS_ON_TABLE = 2;
const IS_WAR = 3;
const FINISHED = 4;

const PLAYER_A = "A";
const PLAYER_B = "B";

// The deck is divided evenly among the players, giving each a down stack.
class PlayingCard {
  constructor(rank, suit) {
    this.rank = rank;
    this.suit = suit;
  }
}
class CardDeck {
  constructor() {
    // No jokers
    const RANKS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      SUITS = ['s', 'c', 'd', 'h'];
    this.cards = [];

    RANKS.forEach(function (rank) {
      SUITS.forEach(function (suit) {
        this.cards.push(new PlayingCard(rank, suit));
      }, this);
    }, this);
    return this;
  }

  shuffle() {
    for (let i = this.cards.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [this.cards[i - 1], this.cards[j]] = [this.cards[j], this.cards[i - 1]];
    }
    return this;
  }

  drawCards(numCards) {
    return this.cards.splice(0, numCards);
  }

  static compareCards(card1, card2) {
    if (card1.rank > card2.rank) {
      return 1;
    } else if (card1.rank === card2.rank) {
      return 0;
    }
    return -1;
  }
}

export {PlayingCard, CardDeck};

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
    return (<div className="stack active" tabIndex="1" autoFocus="true" onClick={() => props.clickHandle()}>
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

class WarCardGame extends React.Component {

  constructor() {
    super();
    this.deck = new CardDeck().shuffle();
    this.state = {
      status: NOT_STARTED,
      stackA: [],
      stackB: [],
      cardA: false,
      cardB: false,
      warCardA: false,
      warCardB: false,
    }
  }

  handleStart() {
    // New shuffled deck
    this.setState({
      status: READY,
      stackA: this.deck.drawCards(26),
      stackB: this.deck.drawCards(26),
      cardA: false,
      cardB: false,
      warCardA: false,
      warCardB: false,
    });
  }

  handleNextMove() {
    // Manual advance
    clearTimeout(this.timer);

    // Check if the game has been started.
    if (this.state.status === NOT_STARTED || this.state.status === FINISHED) {
      return this.handleStart();
    }
    else if (this.state.status === READY) {
      const cardA = this.state.stackA.pop();
      const cardB = this.state.stackB.pop();
      this.setState({
        status: CARDS_ON_TABLE,
        cardA: cardA,
        cardB: cardB,
      });
      this.timer = setTimeout(function () {
        this.handleNextMove();
      }.bind(this), 1000);
    }
    else if (this.state.status === CARDS_ON_TABLE) {
      const result = CardDeck.compareCards(this.state.cardA, this.state.cardB);
      const stackA = this.state.stackA.slice();
      const stackB = this.state.stackB.slice();
      if (result === 1) {
        stackA.push(this.state.cardA);
        stackA.push(this.state.cardB);
      } else if (result === -1) {
        stackB.push(this.state.cardA);
        stackB.push(this.state.cardB);
      } else {
        // WAR!
      }
      this.setState({
        status: READY,
        stackA: stackA,
        stackB: stackB,
        cardA: false,
        cardB: false,
      });
    }
    else if (this.state.status === IS_WAR) {

    }
  }

  render() {
    return (
      <div className="war-game">
        <div className="card-layout">
          <div className="card-col">
            <PlayerStack
              clickHandle={() => this.handleNextMove()}
              player={PLAYER_A}
              playerCardCount={this.state.stackA.length}
            />
          </div>
          <div className="card-col">
            <Card face={this.state.cardA}/>
            <Card showBack={this.state.warCardA}/>
          </div>
          <div className="card-col">
            <Card face={this.state.cardB}/>
            <Card showBack={this.state.warCardB}/>
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
