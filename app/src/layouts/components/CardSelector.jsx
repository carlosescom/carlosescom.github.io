import React, { Component } from 'react'
import { DrizzleContext } from 'drizzle-react'
import { newContextComponents } from 'drizzle-react-components';
import _ from 'lodash'
import ZionWilson from '../../img/ZionWilson.jpeg'
import BamAdebayo from '../../img/BamAdebayo.jpg'

const { ContractData } = newContextComponents;

class CardSelector extends Component {

  constructor(props) {
    super(props)
    this.state = {
      drizzle: props.drizzle,
      drizzleState: props.drizzleState,
      initialized: false,
      playerName: props.drizzle.contracts.AthleteToken.methods.playerName(0).call(),
      tableRow: {
        background: '#000',
        color: '#fff',
        padding: '2px',
        fontWeight: 'bold',
      },
      tableData: {
        _1st: { width: '80%'},
        _2nd: { },
      },
      tableHeader: {
        background: '#777'
      },
      tokenId: 0,
    }
    this.playerName = props.drizzle.contracts.AthleteToken.methods.playerName(0).call()
    this.images = {
      'Zion Wilson': ZionWilson,
      'Bam Adebayo': BamAdebayo,
    }
    this.componentDidMount = this.componentDidMount.bind(this)
    this.changeCard = this.changeCard.bind(this)
  }

  componentDidMount() {
    var CardSelector = this
    this.unsubscribe = this.props.drizzle.store.subscribe(function () {
      /**
      * It's important to refresh drizzleState by calling this method
      * from drizzle.store, otherwise, even though a change is observed
      * in drizzle.store drizzleState will remain the same.
     */
      var drizzle = CardSelector.state.drizzle
      var drizzleState = drizzle.store.getState()
      if (drizzleState.drizzleStatus.initialized) {
        CardSelector.setState((state, prevState) => {
          return {
            drizzle: drizzle,
            drizzleState: drizzleState,
            initialized: true,
            ...prevState
          }
        })
      }
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  componentDidUpdate() {
  }

  changeCard(event) {
    const { value } = event.target
    let contracts = this.state.drizzle.contracts
    contracts.AthleteToken.methods.playerName(value).call().then(r => {
      this.playerName = r
    }).then(r => {
      console.log(value, this.playerName)
    })
    this.setState((state, prevState) => {
      return {
        tokenId: value,
        playerName: this.playerName,
        ...prevState,
      }
    })
  }

  render() {
    return (
      <div className='pure-u-1'>
        
        <div className='pure-u-1-2'>
          <div className='container'>

            <h2>College Card Collectibles Token Fields</h2>

            <form className='pure-form'>
              <fieldset>
                <label htmlFor='selectedCard'>
                  <strong>Select card by ID: </strong>
                </label>
                <input
                  id='selectedCard'
                  type='number'
                  value={this.state.tokenId}
                  onChange={this.changeCard} />
              </fieldset>
            </form>

            <table
              className='pure-table'
              style={{
                width: '100%',
                border: 'none'
              }}
            >
              <tbody>
                <tr style={this.state.tableRow}>
                  <th style={this.state.tableHeader}>
                    <div>Field</div>
                  </th>
                  <th style={this.state.tableHeader}>
                    <div>Value</div>
                  </th>
                </tr>
                {_.range(11)
                  .map(
                  index => {
                    let stats = [
                      'gamesPlayed',
                      'gamesStarted',
                      'minutesPerGame',
                      'fieldGoalPercentage',
                      'threPointFieldGoalPercentage',
                      'freeThrowPercentage',
                      'reboundsPerGame',
                      'assistsPerGame',
                      'stealsPerGame',
                      'blocksPerGame',
                      'pointsPerGame'
                    ]
                    return(
                      <tr key={index} style={this.state.tableRow}>
                        <td style={this.state.tableData._1st}>{stats[index]}</td>
                        <td style={this.state.tableData._2nd}>
                          <div>
                            <ContractData
                              drizzle={this.props.drizzle}
                              drizzleState={this.props.drizzleState}
                              contract={'AthleteToken'}
                              method={'basketballStats'}
                              methodArgs={[this.state.tokenId,index]}
                            />
                          </div>
                        </td>
                      </tr>
                    )
                  }
                )}
              </tbody>
            
            </table>

          </div>
        </div>

        <div className='pure-u-1-2'>
          <div className='container'>
            <ContractData
              drizzle={this.props.drizzle}
              drizzleState={this.props.drizzleState}
              contract={'AthleteToken'}
              method={'playerName'}
              methodArgs={[this.state.tokenId]}
              value={this.state.playerName}
            />
            <img
              src={this.images[this.state.playerName]}
              alt={this.state.playerName}
              style={{ width: '100%' }}
            />
          </div>
        </div>

      </div>
    )
  }
}

export default () => (
  <DrizzleContext.Consumer>
    {drizzleContext => {
      const { drizzle, drizzleState, initialized } = drizzleContext;
      if (!initialized) {
        return 'Loading...';
      }
      return (
        <CardSelector
          drizzle={drizzle}
          drizzleState={drizzleState}
        />
      )
    }}
  </DrizzleContext.Consumer>
)