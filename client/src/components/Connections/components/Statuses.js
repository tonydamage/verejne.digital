// @flow
import React from 'react'
import {compose} from 'redux'
import {branch, renderNothing} from 'recompose'
import EntitySearchWrapper, {type EntitySearchProps} from '../dataWrappers/EntitySearchWrapper'
import EntityWrapper, {type EntityProps} from '../dataWrappers/EntityWrapper'
import ConnectionWrapper, {type ConnectionProps} from '../dataWrappers/ConnectionWrapper'
import './Statuses.css'

type EmptyHandler = () => void

const translateZaznam = (count: number) => {
  const button = <strong>{count}</strong>
  if (count === 1) {
    return <span>Nájdený {button} záznam</span>
  } else if (count > 1 && count < 5) {
    return <span>Nájdené {button} záznamy</span>
  }
  return <span>Nájdených {button} záznamov</span>
}

type Props = {
  showAlternatives1: boolean,
  showAlternatives2: boolean,
  toggleAlternatives1: EmptyHandler,
  toggleAlternatives2: EmptyHandler,
} & EntitySearchProps &
  EntityProps &
  ConnectionProps

const Statuses = ({
  entity1,
  entity2,
  connections,
  showAlternatives1,
  showAlternatives2,
  toggleAlternatives1,
  toggleAlternatives2,
}: Props) => (
  <div className="statuses">
    {connections.length > 0 ? (
      <p id="search-status" className="searchStatus">
        <span>Dĺžka prepojenia:</span> <strong>{connections.length - 1}</strong>
      </p>
    ) : (
      <p id="search-status" className="searchStatus">
        Prepojenie neexistuje.
      </p>
    )}
    <p id="search-status1" className="searchStatus">
      {translateZaznam(entity1.eids.length)}
      <span> pre</span> <strong>&quot;{entity1.query}&quot;</strong>
    </p>
    <p id="search-status2" className="searchStatus">
      {translateZaznam(entity2.eids.length)}
      <span> pre</span> <strong>&quot;{entity2.query}&quot;</strong>
    </p>
  </div>
)

export default compose(
  EntitySearchWrapper,
  branch(
    ({entitySearch1, entitySearch2}: EntitySearchProps): boolean =>
      !!entitySearch1 && !!entitySearch2,
    compose(
      EntityWrapper,
      ConnectionWrapper,
    ),
    renderNothing
  )
)(Statuses)
