import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    prepareHeaders: (headers, {getState}) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token = getState().auth.user.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Books'],
  endpoints: build => ({
    getBooks: build.query({
      query: query => `books?query=${encodeURIComponent(query)}`,
      providesTags: result => {
        if (result)
          return [
            ...result.map(({id}) => ({type: 'Book', id})),
            {type: 'Book', id: 'LIST'},
          ]
        return [{type: 'Book', id: 'LIST'}]
      },
      transformResponse: (response, meta, arg) => response?.books,
    }),
    addBook: build.mutation({
      query: body => ({
        url: `Books`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{type: 'Book', id: 'LIST'}],
    }),
    getBook: build.query({
      query: id => `books/${id}`,
      providesTags: (result, error, id) => [{type: 'Book', id}],
      transformResponse: (response, meta, arg) => response?.book,
    }),
    updateBook: build.mutation({
      query: body => ({
        url: `list-items`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, {id}) => [{type: 'Book', id}],
    }),
    deleteBook: build.mutation({
      query(id) {
        return {
          url: `books/${id}`,
          method: 'DELETE',
        }
      },
      invalidatesTags: (result, error, id) => [{type: 'Post', id}],
    }),
    //listItem
    getListItem: build.query({
      query: () => `list-items`,
      providesTags: result => {
        if (result) {
          return [
            ...result.map(({id}) => ({type: 'ListItem', id})),
            {type: 'ListItems', id: 'LIST'},
          ]
        }
        return [{type: 'ListItems', id: 'LIST'}]
      },
      transformResponse: (response, meta, arg) => response?.listItems,
    }),
    addToReadingList: build.mutation({
      query: ({bookId}) => ({
        url: `list-items`,
        method: 'POST',
        body: {bookId},
      }),
      invalidatesTags: (result, error, {bookId}) => [
        {type: 'ListItems', id: 'LIST'},
      ],
    }),
    finishBook: build.mutation({
      query: ({id, ...patch}) => ({
        url: `list-items/${id}`,
        method: 'PUT',
        body: {id, ...patch},
      }),
      invalidatesTags: (result, error, {id}) => [{type: 'ListItem', id}],
    }),
    removeFromList: build.mutation({
      query: id => ({
        url: `list-items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, {id}) => [{type: 'ListItem', id}],
    }),
  }),
})

export const {
  useGetBookQuery,
  useGetBooksQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useGetListItemQuery,
  useAddToReadingListMutation,
  useRemoveFromListMutation,
  useFinishBookMutation,
} = api
