// @flow
import React from 'react'
import Politician from './Politician'
import {Table} from 'reactstrap'
import PoliticiansListWrapper from './PoliticiansListWrapper'
import {withRouter} from 'react-router'
import {connect} from 'react-redux'
import {compose} from 'redux'
import {FaSortUp, FaSortDown} from 'react-icons/fa'
import {isItCandidatesListSelector} from '../../../selectors'
import {setProfileSort} from '../../../actions/profileActions'

import './PoliticiansList.css'

import type {ContextRouter} from 'react-router-dom'
import type {
  Politician as PoliticianType,
  State,
  PoliticiansSortState,
  PoliticiansSortKey,
} from '../../../state'

type PoliticianListProps = {
  politicians: Array<PoliticianType>,
  isItCandidatesList: boolean,
  setProfileSort: typeof setProfileSort,
  politicianGroup: string,
  sortState: PoliticiansSortState,
}

type HeaderCellProps = {
  text: string,
  title?: string,
  sortKey: PoliticiansSortKey,
  active: boolean,
  reversedAlphanumSort: boolean,
  setProfileSort: typeof setProfileSort,
  politicianGroup: string,
}

// if true, default sort will be from highest to lowest (usefull for numeric columns)
const defaultSortReverse = {
  surname: false,
  party_abbreviation: false,
  latest_income: true,
  num_fields_gardens: true,
  num_houses_flats: true,
  num_others: true,
}

const HeaderCell = ({
  text,
  title,
  sortKey,
  active,
  reversedAlphanumSort,
  setProfileSort,
  politicianGroup,
}: HeaderCellProps) => (
  <th
    className="clickable text-left column-title"
    onClick={() =>
      setProfileSort(
        politicianGroup,
        sortKey,
        active ? !reversedAlphanumSort : defaultSortReverse[sortKey]
      )
    }
    title={title}
  >
    {text} {active ? reversedAlphanumSort ? <FaSortUp /> : <FaSortDown /> : ''}
  </th>
)

const PoliticiansList = ({
  politicians,
  politicianGroup,
  sortState,
  isItCandidatesList,
  setProfileSort,
}: PoliticianListProps) => (
  <Table id="politicians-table">
    <thead>
      <tr>
        <th />
        <th />
        <HeaderCell
          text="Meno a priezvisko"
          sortKey="surname"
          active={sortState.sortKey === 'surname'}
          reversedAlphanumSort={sortState.reverse}
          setProfileSort={setProfileSort}
          politicianGroup={politicianGroup}
        />
        {!isItCandidatesList && (
          <HeaderCell
            text="Strana"
            sortKey="party_abbreviation"
            active={sortState.sortKey === 'party_abbreviation'}
            reversedAlphanumSort={sortState.reverse}
            setProfileSort={setProfileSort}
            politicianGroup={politicianGroup}
          />
        )}
        <HeaderCell
          text="Ročný príjem"
          sortKey="latest_income"
          active={sortState.sortKey === 'latest_income'}
          reversedAlphanumSort={sortState.reverse}
          setProfileSort={setProfileSort}
          politicianGroup={politicianGroup}
        />
        <HeaderCell
          text="Stavby"
          title="Domy, byty a iné stavby"
          sortKey="num_houses_flats"
          active={sortState.sortKey === 'num_houses_flats'}
          reversedAlphanumSort={sortState.reverse}
          setProfileSort={setProfileSort}
          politicianGroup={politicianGroup}
        />
        <HeaderCell
          text="Orná pôda &amp; záhrady"
          sortKey="num_fields_gardens"
          active={sortState.sortKey === 'num_fields_gardens'}
          reversedAlphanumSort={sortState.reverse}
          setProfileSort={setProfileSort}
          politicianGroup={politicianGroup}
        />
        <HeaderCell
          text="Ostatné"
          sortKey="num_others"
          active={sortState.sortKey === 'num_others'}
          reversedAlphanumSort={sortState.reverse}
          setProfileSort={setProfileSort}
          politicianGroup={politicianGroup}
        />
      </tr>
    </thead>
    <tbody>
      {politicians.map((politician, i) => (
        <Politician key={politician.id} index={i} politician={politician} />
      ))}
    </tbody>
  </Table>
)

export default compose(
  PoliticiansListWrapper,
  withRouter,
  connect(
    (state: State, props: ContextRouter) => ({
      isItCandidatesList: isItCandidatesListSelector(state, props),
    }),
    {setProfileSort}
  )
)(PoliticiansList)
