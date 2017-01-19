/**
 * Created by adamsro on 1/18/17.
 */
import React from 'react';
import {WarGame} from './war';
import './app.css';

function CardView(props) {
  if (props.faceUp) {
    return <img className="card" src={"/cards/" + props.rank + props.suit + ".svg"} alt="card X" />
  }
  return <img className="card" src="/cards/back.svg" alt="Back of Card" />
}

function Stack(props) {
  return (<div className="stack">
      {props.stack.hasCards()
        ? <CardView {...props.stack.peek()}/>
        : <img className="card" src="/cards/empty.svg" alt="Card used to be here" />
      }
      {props.game.winner === props.player
        ? <p className="text-center">Player {props.player}<br /> {props.stack.cards.length} cards<br />WINS!</p>
        : <p className="text-center">Player {props.player}<br /> {props.stack.cards.length} cards</p>
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

export class WarApp extends React.Component {
  render() {
    return (
      <div className="card-layout">
        <div className="card-col">
          <StackActive player={WarGame.PLAYER_A} game={this.props.game} stack={this.props.game.stackA} />
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
          <Stack player={WarGame.PLAYER_B} game={this.props.game} stack={this.props.game.stackB} />
        </div>
      </div>
    );
  }
}