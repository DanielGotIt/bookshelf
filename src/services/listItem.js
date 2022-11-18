import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const listItemApi = createApi({
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
  tagTypes: ['ListItems'],
  endpoints: build => ({
    getListItem: build.query({
      query: () => `list-items`,
      providesTags: result => {
        if (result)
          return [
            ...result.map(({id}) => ({type: 'ListItems', id})),
            {type: 'ListItems', id: 'LIST'},
          ]
        return [{type: 'ListItems', id: 'LIST'}]
      },
      transformResponse: (response, meta, arg) => response?.listItems,
    }),
    addToReadingList: build.mutation({
      query: body => ({
        url: `list-items`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, {id}) => [{type: 'ListItem', id}],
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
  useGetListItemQuery,
  useAddToReadingListMutation,
  useFinishBookMutation,
  useRemoveFromListMutation,
} = listItemApi
