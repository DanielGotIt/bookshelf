/** @jsx jsx */
import {jsx} from '@emotion/core'

import {BookListUL} from './lib'
import {BookRow} from './book-row'
import {Profiler} from './profiler'
import {useGetListItemQuery} from 'services/book'

function ListItemList({filterListItems, noListItems, noFilteredListItems}) {
  const {data: listItems = []} = useGetListItemQuery()

  const filteredListItems = listItems.filter(filterListItems)

  if (!listItems.length) {
    return <div css={{marginTop: '1em', fontSize: '1.2em'}}>{noListItems}</div>
  }
  if (!filteredListItems.length) {
    return (
      <div css={{marginTop: '1em', fontSize: '1.2em'}}>
        {noFilteredListItems}
      </div>
    )
  }

  return (
    <Profiler
      id="List Item List"
      metadata={{listItemCount: filteredListItems.length}}
    >
      <BookListUL>
        {filteredListItems.map(listItem => (
          <li key={listItem.id} aria-label={listItem.book.title}>
            <BookRow book={listItem.book} />
          </li>
        ))}
      </BookListUL>
    </Profiler>
  )
}

export {ListItemList}
