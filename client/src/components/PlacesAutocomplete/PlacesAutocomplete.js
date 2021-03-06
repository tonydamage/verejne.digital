// @flow
import React from 'react'
import GoogleAutocomplete from 'react-places-autocomplete'
import {withHandlers, defaultProps, compose} from 'recompose'
import classnames from 'classnames'
import './PlacesAutocomplete.css'

type OnError = (status: string, clearSuggestions: Function) => any
type OnSelect = (address: string, placeId: ?string) => any
type Props = {
  value: string,
  onChange: (value: string) => any,
  onErrorBinded: OnError,
  searchOptions: Object,
  onSelect: OnSelect,
  className: string,
}

const PlacesAutocomplete = ({
  value,
  onChange,
  onSelect,
  onErrorBinded,
  searchOptions,
  className,
}: Props) => (
  <GoogleAutocomplete
    type="text"
    className="form-control"
    placeholder="Hľadaj adresu"
    value={value}
    onChange={onChange}
    onSelect={onSelect}
    onError={onErrorBinded}
    searchOptions={searchOptions}
    googleCallbackName="placesAutocompleteCallback"
  >
    {({getInputProps, suggestions, getSuggestionItemProps}) => (
      <div className="autocomplete">
        <input
          {...getInputProps({
            placeholder: 'Hľadaj adresu...',
            className: classnames(className, 'autocomplete__input'),
            autoFocus: true,
          })}
        />
        {suggestions.length > 0 && (
          <div className="autocomplete__suggestions">
            {suggestions.map((suggestion) => {
              const className = classnames(
                'autocomplete__suggestions__item',
                suggestion.active && 'autocomplete__suggestions__item--active'
              )
              return (
                <div {...getSuggestionItemProps(suggestion, {className})} key={suggestion.id}>
                  <strong>{suggestion.formattedSuggestion.mainText}</strong>{' '}
                  <small>{suggestion.formattedSuggestion.secondaryText}</small>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )}
  </GoogleAutocomplete>
)

export default compose(
  defaultProps({
    searchOptions: {},
  }),
  withHandlers({
    onErrorBinded: (props) => (status, clearSuggestions) =>
      props.onError && props.onError(status, clearSuggestions),
  })
)(PlacesAutocomplete)
