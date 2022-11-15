/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import {
  FaCheckCircle,
  FaPlusCircle,
  FaMinusCircle,
  FaBook,
  FaTimesCircle,
} from 'react-icons/fa'
import Tooltip from '@reach/tooltip'
import {
  useListItem,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
} from 'utils/list-items'
import * as colors from 'styles/colors'
import {useAsync} from 'utils/hooks'
import {CircleButton, Spinner} from './lib'
import {
  useGetListItemQuery,
  useFinishBookMutation,
  useRemoveFromListMutation,
  useAddToReadingListMutation,
} from 'services/book'

function TooltipButton({label, status, highlight, onClick, icon, ...rest}) {
  const {isLoading, isError, error, reset} = status || {}

  function handleClick() {
    if (isError) {
      reset()
    } else {
      onClick()
    }
  }

  return (
    <Tooltip label={isError ? error.message : label}>
      <CircleButton
        css={{
          backgroundColor: 'white',
          ':hover,:focus': {
            color: isLoading
              ? colors.gray80
              : isError
              ? colors.danger
              : highlight,
          },
        }}
        disabled={isLoading}
        onClick={handleClick}
        aria-label={isError ? error.message : label}
        {...rest}
      >
        {isLoading ? <Spinner /> : isError ? <FaTimesCircle /> : icon}
      </CircleButton>
    </Tooltip>
  )
}

function StatusButtons({book}) {
  // const listItem = useListItem(book.id)
  const {data: listItems = []} = useGetListItemQuery()
  const listItem = listItems?.find(li => li.bookId === book.id) ?? null

  console.log('listItem', listItem)
  // const listItem = book

  const [handleRemoveClick] = useRemoveListItem({throwOnError: true})
  const [addtoReadingList, statusAddingToList] = useAddToReadingListMutation()

  const [finishBook, statusFinishingBook] = useFinishBookMutation()
  const [removeFromList, statusRemovingFromList] = useRemoveFromListMutation()

  return (
    <React.Fragment>
      {listItem ? (
        Boolean(listItem.finishDate) ? (
          <TooltipButton
            label="Mark as unread"
            highlight={colors.yellow}
            onClick={() => removeFromList(listItem.id)}
            status={statusRemovingFromList}
            icon={<FaBook />}
          />
        ) : (
          <TooltipButton
            label="Mark as read"
            highlight={colors.green}
            onClick={() =>
              finishBook({id: listItem.id, finishDate: Date.now()})
            }
            status={statusFinishingBook}
            icon={<FaCheckCircle />}
          />
        )
      ) : null}
      {listItem ? (
        <TooltipButton
          label="Remove from list"
          highlight={colors.danger}
          onClick={() => handleRemoveClick({id: listItem.id})}
          icon={<FaMinusCircle />}
        />
      ) : (
        <TooltipButton
          label="Add to list"
          highlight={colors.indigo}
          onClick={() => addtoReadingList({bookId: book.id})}
          status={statusAddingToList}
          icon={<FaPlusCircle />}
        />
      )}
    </React.Fragment>
  )
}

export {StatusButtons}
