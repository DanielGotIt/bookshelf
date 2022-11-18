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
import * as colors from 'styles/colors'
import {CircleButton, Spinner} from './lib'
import {
  useUpdateListItemMutation,
  useRemoveFromListMutation,
  useAddToReadingListMutation,
} from 'services/book'
import {useListItem} from 'utils/listItemHook'

function TooltipButton({
  label,
  paramsOnClick,
  mutationHook,
  highlight,
  icon,
  ...rest
}) {
  const [onClick, {isLoading, isError, error, reset}] = mutationHook()

  function handleClick() {
    if (isError) {
      reset()
    } else {
      onClick(paramsOnClick)
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
  const {listItem} = useListItem(book.id)

  return (
    <React.Fragment>
      {listItem ? (
        Boolean(listItem.finishDate) ? (
          <TooltipButton
            label="Mark as unread"
            highlight={colors.yellow}
            mutationHook={useUpdateListItemMutation}
            paramsOnClick={{id: listItem.id, finishDate: null}}
            icon={<FaBook />}
          />
        ) : (
          <TooltipButton
            label="Mark as read"
            highlight={colors.green}
            mutationHook={useUpdateListItemMutation}
            paramsOnClick={{id: listItem.id, finishDate: Date.now()}}
            icon={<FaCheckCircle />}
          />
        )
      ) : null}
      {listItem ? (
        <TooltipButton
          label="Remove from list"
          highlight={colors.danger}
          mutationHook={useRemoveFromListMutation}
          paramsOnClick={listItem.id}
          icon={<FaMinusCircle />}
        />
      ) : (
        <TooltipButton
          label="Add to list"
          highlight={colors.indigo}
          mutationHook={useAddToReadingListMutation}
          paramsOnClick={{bookId: book.id}}
          icon={<FaPlusCircle />}
        />
      )}
    </React.Fragment>
  )
}

export {StatusButtons}
