import React from 'react';

const READY = 0;
const CARDS_ON_TABLE = 1;
const FINISHED = 2;

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
        : <p className="text-center">Player {props.player}<br /> {props.stack.length} cards</p>
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

  /**
   * Click handler for Player A card
   */
  handleNextMove() {
    // Manual advance
    clearTimeout(this.timer);

    if (this.state.status === FINISHED) {
      this.init();
    }
    else if (this.state.status === READY) {
      this.stateReady();
    }
    else if (this.state.status === CARDS_ON_TABLE) {
      this.stateCardsOnTable();
    }
  }

  /**
   * Reset function. TODO combine with constructor
   */
  init() {
    // New shuffled deck
    this.deck = new Deck().shuffle().shuffle().shuffle();
    this.setState({
      status: READY,
      stackA: this.deck.drawCards(26),
      stackB: this.deck.drawCards(26),
      playedA: [],
      playedB: [],
      winner: false,
    });
  }

  /**
   * State: Both players have cards stacks but no cards in play.
   */
  stateReady() {
    const cardA = this.state.stackA.pop();
    cardA.faceUp = true;

    const cardB = this.state.stackB.pop();
    cardB.faceUp = true;

    this.setState({
      status: CARDS_ON_TABLE,
      playedA: [cardA],
      playedB: [cardB],
    });
    this.timer = setTimeout(function () {
      this.handleNextMove();
    }.bind(this), 1000);
  }

  /**
   * State: Players have cards face up on the table and a comparison needs to be made.
   */
  stateCardsOnTable() {
      let status = READY;
      let stackA = this.state.stackA.slice();
      let stackB = this.state.stackB.slice();
      let playedA = this.state.playedA.slice();
      let playedB = this.state.playedB.slice();
      let winner = false;

      // Compare cards last played.
      const result = Deck.compareCards(playedA[playedA.length - 1], playedB[playedB.length - 1]);

      if (result === 1) {

        // Player A takes the spoils.
        playedA.forEach((card) => { card.faceUp = false });
        playedB.forEach((card) => { card.faceUp = false });
        stackA = playedB.concat(playedA, stackA);
        playedA = playedB = [];
        // Check for the win
        if (stackB.length <= 0) {
          winner = PLAYER_A;
          status = FINISHED;
        }
      } else if (result === -1) {

        // Player B takes the spoils.
        playedA.forEach((card) => { card.faceUp = false });
        playedB.forEach((card) => { card.faceUp = false });
        stackB = playedA.concat(playedB, stackB);
        playedA = playedB = [];
        // Check for the win
        if (stackA.length <= 0) {
          winner = PLAYER_B;
          status = FINISHED;
        }

      } else {

        // WAR!
        if (stackB.length < 2) {
          // Player B doest have enough cards - Player A wins
          winner = PLAYER_A;
          status = FINISHED;
        } else if (stackA.length < 2) {
          // Player A doest have enough cards - Player B wins
          winner = PLAYER_B;
          status = FINISHED;
        } else {
          // One card face down, one card face up.
          playedA.push(stackA.pop());
          const cardA = stackA.pop();
          cardA.faceUp = true;
          playedA.push(cardA);

          // One card face down, one card face up.
          playedB.push(stackB.pop());
          const cardB = stackB.pop();
          cardB.faceUp = true;
          playedB.push(cardB);

          // Repeat this sequence since no winner has been determined yet.
          status = CARDS_ON_TABLE;
        }

        if (status !== FINISHED) {
          this.timer = setTimeout(function () {
            this.handleNextMove();
          }.bind(this), 1000);
        }
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

  render() {
    return (
      <div className="card-layout">
        <div className="card-col">
          <StackActive
            clickHandle={() => this.handleNextMove()}
            player={PLAYER_A}
            stack={this.state.stackA}
            isWinner={this.state.winner === PLAYER_A} />
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
          <Stack
            player={PLAYER_B}
            stack={this.state.stackB}
            isWinner={this.state.winner === PLAYER_B} />
        </div>
      </div>
    );
  }
}

export default WarCardGame;
