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
        console.log('🚀 ~ file: book.js ~ line 29 ~ result', result)
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
      query: ({id, ...patch}) => ({
        url: `books/${id}`,
        method: 'PUT',
        body: patch,
      }),
      async onQueryStarted({id, ...patch}, {dispatch, queryFulfilled}) {
        const patchResult = dispatch(
          api.util.updateQueryData('getPost', id, draft => {
            Object.assign(draft, patch)
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: (result, error, {id}) => [{type: 'Post', id}],
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
  }),
})

export const {
  useGetBookQuery,
  useGetBooksQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = api
