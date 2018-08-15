// @flow
import React from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {branch} from 'recompose'
import {withDataProviders} from 'data-provider'
import {isNil} from 'lodash'
import type {ComponentType} from 'react'
import {isPolitician} from '../../Notices/utilities'
import {
  connectionSubgraphProvider,
  connectionEntityDetailProvider,
} from '../../../dataProviders/connectionsDataProviders'
import {addEdgeIfMissing} from '../components/graph/utils'
import type {State, Company, RelatedEntity, Graph, GraphId, Node, Edge} from '../../../state'
import type {EntityProps} from './EntityWrapper'
import type {ConnectionProps} from './ConnectionWrapper'

type EntityDetails = {
  [string]: {
    name: string,
    // TODO: TBD import from state when available
    data: {
      related: Array<RelatedEntity>,
      entities: Array<{entity_name: string}>,
    } & Company,
  },
}

export type OwnProps = {
  preloadNodes: boolean,
}

export type SubgraphProps = {
  selectedEids: Array<string>,
  subgraph: Graph,
  entityDetails: EntityDetails,
}

type RawNode = {
  eid: string | number,
  entity_name: string,
  distance_from_A: number,
  distance_from_B: number,
}
type RawEdge = [string, string]

function findGroup(data: Company) {
  const politician = isPolitician(data)
  const withContracts = data.total_contracts && data.total_contracts > 0
  return politician && withContracts
    ? 'politContracts'
    : politician
      ? 'politician'
      : withContracts
        ? 'contracts'
        : 'normal'
}

function bold(makeBold: boolean, str: string) {
  return makeBold ? `*${str}*` : str
}

function enhanceGraph(
  {nodes: oldNodes, edges: oldEdges, nodeIds}: Graph,
  entityDetails: EntityDetails,
  primaryConnEids: Array<string>
) {
  const edges = oldEdges.map(({from, to}) => ({
    from,
    to,
    // primary edges (corresponding to the 1 shortest connection found) are wider
    width: primaryConnEids.indexOf(from) !== -1 && primaryConnEids.indexOf(to) !== -1 ? 5 : 1,
  }))

  // adds entity info to graph
  const nodes = oldNodes.map(({id, label, x, y, ...props}) => {
    if (!entityDetails[id]) {
      return {id, label, group: 'notLoaded', x, y, ...props}
    }
    const data = entityDetails[id].data
    const entity = data.entities[0]
    const poi = props.distA === 0 || props.distB === 0
    if (props.leaf && data.related.length) {
      // add more edges to this leaf if available, then mark as non-leaf
      data.related.forEach(({eid}: RelatedEntity) => {
        if (nodeIds[eid.toString()]) {
          addEdgeIfMissing(id, eid.toString(), edges)
        }
      })
    }
    return {
      // delete x, y to prevent jumping on node load
      ...props,
      id,
      label: bold(poi, `${entity.entity_name} (${data.related.length})`),
      value: data.related.length,
      group: findGroup(data),
      shape: poi ? 'box' : (data.company_stats[0] || {}).datum_zaniku ? 'diamond' : 'dot',
      leaf: false,
    }
  })
  return {nodes, edges, nodeIds}
}

function transformRaw(rawGraph: {vertices: Array<RawNode>, edges: Array<RawEdge>}): Graph {
  // transforms graph data for react-graph-vis
  const {vertices: rawNodes, edges: rawEdges} = rawGraph
  const nodes: Array<Node> = []
  const edges: Array<Edge> = []
  const nodeIds: {[GraphId]: boolean} = {}

  rawNodes.forEach((n: RawNode) => {
    // skip nodes that are not connected to the other end
    if (n.distance_from_A == null || n.distance_from_B == null) {
      return
    }
    nodes.push({
      id: n.eid.toString(),
      label: n.entity_name,
      distA: n.distance_from_A,
      distB: n.distance_from_B,
    })
    nodeIds[n.eid.toString()] = true
  })

  rawEdges.forEach(([from, to]: RawEdge) => {
    nodeIds[from] && nodeIds[to] && edges.push({from, to})
  })

  return {nodes, edges, nodeIds}
}

const ConnectionWrapper = (WrappedComponent: ComponentType<*>) => {
  const wrapped = (props: SubgraphProps) =>
    isNil(props.subgraph) ? null : <WrappedComponent {...props} />

  return branch(
    ({entity1, entity2}: EntityProps) => entity1.eids.length > 0 && entity2.eids.length > 0,
    compose(
      withDataProviders(({entity1, entity2}: EntityProps) => [
        connectionSubgraphProvider(entity1.eids.join(), entity2.eids.join(), transformRaw),
      ]),
      connect((state: State, props: EntityProps & ConnectionProps) => ({
        selectedEids: state.connections.selectedEids,
        subgraph: enhanceGraph(
          state.connections.subgraph[`${props.entity1.eids.join()}-${props.entity2.eids.join()}`]
            .data,
          state.connections.entityDetails,
          props.connections
        ),
        entityDetails: state.connections.entityDetails,
      })),
      branch(
        ({preloadNodes, subgraph}: OwnProps & SubgraphProps) => subgraph != null && preloadNodes,
        withDataProviders(({subgraph}: SubgraphProps) =>
          subgraph.nodes.map(({id}: Node) => connectionEntityDetailProvider(id, false))
        )
      )
    )
  )(wrapped)
}

export default ConnectionWrapper
