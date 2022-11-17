import {useGetListItemQuery} from 'services/book'

export const useListItem = book => {
  const {data: listItems = [], ...rest} = useGetListItemQuery()
  const listItem = listItems?.find(li => li.bookId === book.id) ?? null

  return {listItem, ...rest}
}
