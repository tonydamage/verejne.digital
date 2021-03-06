// @flow
import React from 'react'
import {connect} from 'react-redux'
import {compose} from 'redux'
import {withHandlers} from 'recompose'
import {FaSearch} from 'react-icons/fa'
import {ListGroupItem, Row, Col} from 'reactstrap'
import {
  toggleEntityInfo,
  toggleModalOpen,
  setEntitySearchFor,
} from '../../../../actions/publicActions'
import {updateValue} from '../../../../actions/sharedActions'
import Info from '../../../shared/Info/Info'
import CircleIcon from '../../../shared/CircleIcon'

import type {NewEntityDetail} from '../../../../state'

import './ListRow.css'

type DetailedInfoProps = {|
  toggleEntityInfo: (eid: number) => void,
  data: NewEntityDetail,
|}

const _DetailedInfo = ({toggleEntityInfo, data}: DetailedInfoProps) => (
  <ListGroupItem action className="list-row detailed-info">
    <Info data={data} onClose={toggleEntityInfo} />
  </ListGroupItem>
)

const DetailedInfo = compose(
  connect(
    null,
    {toggleEntityInfo}
  ),
  withHandlers({
    toggleEntityInfo: ({toggleEntityInfo, eid}) => () => {
      toggleEntityInfo(eid)
    },
  })
)(_DetailedInfo)

type ListRowProps = {
  entityDetail: NewEntityDetail,
  toggleEntityInfo: (id: number) => void,
  showInfo: () => void,
  openModalSearch: () => void,
}

const ListRow = ({entityDetail, toggleEntityInfo, showInfo, openModalSearch}: ListRowProps) =>
  showInfo ? (
    <DetailedInfo eid={entityDetail.eid} data={entityDetail} />
  ) : (
    <ListGroupItem action className="list-row">
      <Row>
        <Col xs="auto" className="px-1">
          <CircleIcon data={entityDetail} className="list-row-icon" size="10" />
        </Col>
        <Col className="px-1 list-row-toggler" onClick={toggleEntityInfo}>
          <span>{entityDetail.name}</span>
        </Col>
        <Col xs="auto" className="px-1">
          <FaSearch size="16" className="search-icon float-right" onClick={openModalSearch} />
        </Col>
      </Row>
    </ListGroupItem>
  )

export default compose(
  connect(
    (state, {entityDetail}) => ({
      showInfo: state.publicly.showInfo[entityDetail.eid],
    }),
    {toggleEntityInfo, toggleModalOpen, setEntitySearchFor, updateValue}
  ),
  withHandlers({
    toggleEntityInfo: ({toggleEntityInfo, entityDetail}) => () => {
      toggleEntityInfo(entityDetail.eid)
    },
    openModalSearch: ({entityDetail, toggleModalOpen, setEntitySearchFor, updateValue}) => () => {
      setEntitySearchFor(entityDetail.name)
      updateValue(
        ['publicly', 'entitySearchValue'],
        entityDetail.name,
        'Set entity search field value'
      )
      toggleModalOpen()
    },
  })
)(ListRow)
