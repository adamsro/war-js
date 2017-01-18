import React from 'react';
import './app.css';
import WarGame from './war';

function CardView(props) {
  if (props.faceUp) {
    return <img className="card" src={"/cards/" + props.rank + props.suit + ".svg"} alt="card X" />
  }
  return <img className="card" src="/cards/back.svg" alt="Back of Card" />
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

class StackActive extends React.Component {
  /**
   * Click handler for Player A card
   */
  handleClick() {
    // this.props.game.nextMove();
  }
  render() {
    return (<div className="clickable" tabIndex="1" autoFocus="true" onClick={this.handleClick()}>
        <Stack {...this.props} />
      </div>
    );
  }
}

export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
      game: new WarGame()
    };
    this.state.game.startGame();
  }


  render() {
    return (
      <div className="card-layout">
        <div className="card-col">
          <StackActive
            player={WarGame.PLAYER_A}
            stack={this.state.game.stackA}
            isWinner={this.state.game.winner === WarGame.PLAYER_A} />
        </div>
        <div className="card-col">
          {this.state.game.playedA.cards.map((card, index) =>
            <CardView key={index} {...card} />
          )}
        </div>
        <div className="card-col">
          {this.state.game.playedB.cards.map((card, index) =>
            <CardView key={index} {...card} />
          )}
        </div>
        <div className="card-col">
          <Stack
            player={WarGame.PLAYER_B}
            stack={this.state.game.stackB}
            isWinner={this.state.winner === WarGame.PLAYER_B} />
        </div>
      </div>
    );
  }
}