import firebase from 'firebase';
const firebaseConfig = {
  apiKey: 'AIzaSyB3oi6NjqSbKpTvkZn7ClJ1ny9NW4p1tVM',
  authDomain: 'photo-feed-7b149.firebaseapp.com',
  databaseURL: 'https://photo-feed-7b149.firebaseio.com',
  projectId: 'photo-feed-7b149',
  storageBucket: 'photo-feed-7b149.appspot.com',
  messagingSenderId: '470999581208',
  appId: '1:470999581208:web:4cfde8a8c26f122878f96d',
  measurementId: 'G-2M1DX7H3NJ',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const f = firebase;
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();
