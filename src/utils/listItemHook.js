import {useGetListItemQuery} from 'services/book'

export const useListItem = bookId => {
  const {data: listItems = [], ...rest} = useGetListItemQuery()
  const listItem = listItems?.find(li => li.bookId === bookId) ?? null

  return {listItem, ...rest}
}
