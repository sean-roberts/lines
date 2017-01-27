# `lines`

This service does one thing, breaks up an HTML document into a JSON array of lines. Allowing you to count or find information in a document.

## Setup

- Clone this repo
- `cd lists` (go into this repo's folder)
- `npm install`
- `npm start`

That's it (🎉), the local lists server is now running at `localhost:3333`!

## Usage

### Getting all lines

Send a `GET` request to the service with the absolute path of the document you want to split lines on.

like:
`https://servicedomain.com/https://htmlinquestion.com/file.html`

example:
```HTML
<script>
  fetch('servicedomain.com/' + window.location.href)
    .then(response => response.json())
    .then(data => console.log(data.lines))
    .catch(err => console.log('Something went wrong:', err));
</script>
```

The response will look like:

```js
{
  "lines": [
    "<html>",
    "  <head>",
    //...
  ]
}
```

### Get lines by RegExp

If you want to search for lines by regex you can use the `?_regexp` param.

like:
`https://servicedomain.com/https://htmlinquestion.com/file.html?_regexp=/something/i`

which returns:

```js
{
  "matches": [
    {
      // raw matching line
      line: "   something happened and I didn't know it at the time",
      // index of the line as it lives inside the document
      index: 50
    },
    {
      line: "   something else happened",
      index: 124
    },
    // ... and so on for all matches
  ]
}
```
*Note* there is a difference between responses with `?_regexp` and without it. So don't say I didn't warn you ;)

## Built On
[`micro`](https://github.com/zeit/micro) with some [`fetch`](https://github.com/andris9/fetch) and [`url`](https://github.com/defunctzombie/node-url) help

## License

Copyright ©️ 2017 Sean Roberts, licensed under the MIT License. See [`LICENSE`](./LICENSE) for more information.
