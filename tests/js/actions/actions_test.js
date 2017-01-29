import assert from 'power-assert'
import { selectSubreddit,
         invalidateSubreddit,
         requestPosts,
         receivePosts,
         fetchPosts,
         fetchPostsIfNeeded
       } from '../../../src/js/actions/actions'
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';


describe('test action creater', () => {
  it('test selectSubreddit', () => {
    const subreddit = 'test'
    const expectedAction = { type : 'SELECT_SUBREDDIT', subreddit }
    assert.deepStrictEqual(selectSubreddit(subreddit), expectedAction)
  })

  it('test invalidateSubreddit', () => {
    const subreddit = 'test'
    const expectedAction = { type : 'INVALIDATE_SUBREDDIT', subreddit }
    assert.deepStrictEqual(invalidateSubreddit(subreddit), expectedAction)
  })

  it('test requestPosts', () => {
    const subreddit = 'test'
    const expectedAction = { type : 'REQUEST_POSTS', subreddit }
    assert.deepStrictEqual(requestPosts(subreddit), expectedAction)
  })

  it('test selectSubreddit', () => {
    const subreddit = 'test'
    const json = {
      data : {
        children :
          [
            { data : 'test1' },
            { data : 'test2' },
            { data : 'test3' }
          ]
      }
    }
    const dateNow = Date.now()
    const expectedAction = { type : 'RECEIVE_POSTS', subreddit, posts : [ 'test1', 'test2', 'test3' ], receivedAt : dateNow }
    assert.deepStrictEqual(receivePosts(subreddit, json, dateNow), expectedAction)
  })

  it('test fetchPosts', (done) => {
    const middlewares = [ thunk ]
    const mockStore = configureMockStore(middlewares)
    const initialState = {
      items: [],
      isFetching: false,
    }
    const subreddit = 'test'
    const expectedActions = [
      { type: 'REQUEST_POSTS', subreddit },
      { type: 'RECEIVE_POSTS', items: ['items'] },
    ]

    const store = mockStore({})
    return store.dispatch(fetchPosts(subreddit))
      .then(() => {})
  })
})
