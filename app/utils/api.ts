const api = `https://hacker-news.firebaseio.com/v0`;
const json = ".json?print=pretty";

export type PostCategory = "comment" | "story";
export type PostTypes = "top" | "new";
export interface Post {
  id: string;
  url: string;
  title: string;
  time: number;
  by: string;
  descendants?: number;
  dead: boolean;
  deleted: boolean;
  type: PostCategory;
  text: string;
  kids: string[];
}
export interface User {
  id: string;
  submitted: string[];
  created: number;
  karma: number;
  about: string;
}
function removeDead(posts: Post[]) {
  return posts.filter(Boolean).filter(({ dead }) => dead !== true);
}

function removeDeleted(posts: Post[]) {
  return posts.filter(({ deleted }) => deleted !== true);
}

function onlyComments(posts: Post[]) {
  return posts.filter(({ type }) => type === "comment");
}

function onlyPosts(posts: Post[]) {
  return posts.filter(({ type }) => type === "story");
}

export function fetchItem(id: string): Promise<Post> {
  return fetch(`${api}/item/${id}${json}`).then((res) => res.json());
}

export function fetchComments(ids: string[]): Promise<Post[]> {
  return Promise.all(ids.map(fetchItem)).then((comments) =>
    removeDeleted(onlyComments(removeDead(comments)))
  );
}

export function fetchMainPosts(type: PostTypes) {
  return fetch(`${api}/${type}stories${json}`)
    .then((res) => res.json())
    .then((ids: string[]) => {
      if (!ids) {
        throw new Error(`There was an error fetching the ${type} posts.`);
      }

      return ids.slice(0, 50);
    })
    .then((ids) => Promise.all(ids.map(fetchItem)))
    .then((posts) => removeDeleted(onlyPosts(removeDead(posts))));
}

export function fetchUser(id: string): Promise<User> {
  return fetch(`${api}/user/${id}${json}`).then((res) => res.json());
}

export function fetchPosts(ids: string[]): Promise<Post[]> {
  return Promise.all(ids.map(fetchItem)).then((posts) =>
    removeDeleted(onlyPosts(removeDead(posts)))
  );
}
