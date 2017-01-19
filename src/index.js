import React from 'react';
import ReactDOM from 'react-dom';
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
    this.props.game.nextMove();
  }
  render() {
    return (<div className="clickable" tabIndex="1" autoFocus="true" onClick={function() {this.handleClick()}.bind(this)}>
        <Stack {...this.props} />
      </div>
    );
  }
}

export default class WarApp extends React.Component {
  render() {
    return (
      <div className="card-layout">
        <div className="card-col">
          <StackActive
            player={WarGame.PLAYER_A}
            stack={this.props.game.stackA}
            game={this.props.game}
            isWinner={this.props.game.winner === WarGame.PLAYER_A} />
        </div>
        <div className="card-col">
          {this.props.game.playedA.cards.map((card, index) =>
            <CardView key={index} {...card} />
          )}
        </div>
        <div className="card-col">
          {this.props.game.playedB.cards.map((card, index) =>
            <CardView key={index} {...card} />
          )}
        </div>
        <div className="card-col">
          <Stack
            player={WarGame.PLAYER_B}
            stack={this.props.game.stackB}
            isWinner={this.props.winner === WarGame.PLAYER_B} />
        </div>
      </div>
    );
  }
}

const game =  new WarGame();
game.startGame();

function render() {
  ReactDOM.render(
    <WarApp game={game} />,
    document.getElementById('root')
  );
}
game.subscribe(render);
render();
