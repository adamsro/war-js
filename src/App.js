import React, {Component} from 'react';


const READY = 1;
const CARDS_ON_TABLE = 2;
const IS_WAR = 3;
const FINISHED = 4;

const PLAYER_A = "A";
const PLAYER_B = "B";

// The deck is divided evenly among the players, giving each a down stack.
class Card {
  constructor(rank, suit, faceUp = false) {
    this.rank = rank;
    this.suit = suit;
    this.faceUp = faceUp;
  }
}

function CardView(props) {
  if (props.faceUp) {
    return <img className="card" src={"/cards/" + props.rank + props.suit + ".svg"}/>
  }
  return <img className="card" src="/cards/back.svg"/>
}

class Deck {
  constructor() {
    // No jokers
    const RANKS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      SUITS = ['s', 'c', 'd', 'h'];
    this.cards = [];

    RANKS.forEach(function (rank) {
      SUITS.forEach(function (suit) {
        this.cards.push(new Card(rank, suit));
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

export {Card, Deck};


function StackActive(props) {
  return (<div className="clickable" tabIndex="1" autoFocus="true" onClick={() => props.clickHandle()}>
      <Stack {...props} />
    </div>
  );
}
function Stack(props) {
  return (<div className="stack">
      {props.stack.length > 0
        ? <CardView {...props.stack[props.stack.length - 1]}/>
        : <div className="card-spot"></div>
      }
      {props.isWinner === true
        ? <p className="text-center">Player {props.player}<br />WINS!</p>
        : <p className="text-center">Player {props.player}<br /> {props.stack.length} cards remaining</p>
      }
    </div>
  );
}

class WarCardGame extends React.Component {

  constructor() {
    super();
    // New shuffled deck
    this.deck = new Deck().shuffle();
    this.state = {
      status: READY,
      stackA: this.deck.drawCards(26),
      stackB: this.deck.drawCards(26),
      playedA: [],
      playedB: [],
      winner: false,
    };
  }

  handleNextMove() {
    // Manual advance
    clearTimeout(this.timer);

    if (this.state.status === FINISHED) {
      this.constructor();
    }

    else if (this.state.status === READY) {
      const cardA = this.state.stackA.pop();
      cardA.faceUp = true;
      let playedA = [cardA];
      const cardB = this.state.stackB.pop();
      cardB.faceUp = true;
      let playedB = [cardB];

      this.setState({
        status: CARDS_ON_TABLE,
        playedA: playedA,
        playedB: playedB,
      });
      this.timer = setTimeout(function () {
        this.handleNextMove();
      }.bind(this), 1000);
    }

    else if (this.state.status === CARDS_ON_TABLE) {
      let status = READY;
      let winner = false;
      let stackA = this.state.stackA.slice();
      let stackB = this.state.stackB.slice();
      let playedA = this.state.playedA.slice();
      let playedB = this.state.playedB.slice();

      // Compare cards last played
      const result = Deck.compareCards(
        playedA[playedA.length - 1],
        playedB[playedB.length - 1]);

      if (result === 1) {
        playedA.map((card) => {
          card.faceUp = false
        });
        playedB.map((card) => {
          card.faceUp = false
        });
        stackA = playedB.concat(playedA, stackA);
        playedA = [];
        playedB = [];
      } else if (result === -1) {
        playedA.map((card) => {
          card.faceUp = false
        });
        playedB.map((card) => {
          card.faceUp = false
        });
        stackB = playedA.concat(playedB, stackB);
        playedA = [];
        playedB = [];
      } else {
        // WAR!
        playedA.push(stackA.pop());
        const cardA = stackA.pop();
        cardA.faceUp = true;
        playedA.push(cardA);

        playedB.push(stackB.pop());
        const cardB = stackB.pop();
        cardB.faceUp = true;
        playedB.push(cardB);

        status = CARDS_ON_TABLE;

        this.timer = setTimeout(function () {
          this.handleNextMove();
        }.bind(this), 1000);
      }

      this.setState({
        status: status,
        stackA: stackA,
        stackB: stackB,
        playedA: playedA,
        playedB: playedB,
        winner: winner,
      });
    }
  }

  render() {
    return (
      <div className="card-layout">
        <div className="card-col">
          <StackActive
            clickHandle={() => this.handleNextMove()}
            player={PLAYER_A}
            stack={this.state.stackA}
            winner={this.state.winner === PLAYER_A} />
        </div>
        <div className="card-col">
          {this.state.playedA.map((card, index) =>
            <CardView key={index} {...card} />
          )}
        </div>
        <div className="card-col">
          {this.state.playedB.map((card, index) =>
            <CardView key={index} {...card} />
          )}
        </div>
        <div className="card-col">
          <Stack player={PLAYER_B} stack={this.state.stackB} winner={this.state.winner === PLAYER_B} />
        </div>
      </div>
    );
  }
}

export default WarCardGame;
